import { Vector3, Spherical, MathUtils } from "three";

/**
 * @author Francesco Mazzella <francesco@mazzella.dev>
 */
class FirstPersonEditorControls {

    /**
     * 
     * @param {THREE.Camera} object 
     * @param {HTMLElement} domElement 
     */
    constructor(object, domElement) {

        if (domElement === undefined) {
            console.warn('THREE.FirstPersonEditorControls: The second parameter "domElement" is mandatory.');
            domElement = document;
        }

        this.object = object;
        this.domElement = domElement;

        if (this.domElement !== document) {
            this.domElement.setAttribute('tabindex', -1);
        }

        this.domElement.addEventListener('contextmenu', this.#onContextMenu, false);
        this.domElement.addEventListener('mousemove', this.#mouseMove, false);
        this.domElement.addEventListener('mousedown', this.#mouseDown, false);
        this.domElement.addEventListener('mouseup', this.#mouseUp, false);

        window.addEventListener('keydown', this.#keyDown, false);
        window.addEventListener('keyup', this.#keyUp, false);

        this.#setOrientation();
    }

    // #region API

    enabled = true

    movementSpeed = 1.0
    movementAcceleration = 0.15
    lookSpeed = 0.005

    lookVertical = true
    autoForward = false

    activeLook = true

    captureMouse = true

    heightSpeed = false
    heightCoef = 1.0
    heightMin = 0.0
    heightMax = 1.0

    constrainVertical = false
    verticalMin = 0
    verticalMax = Math.PI

    // #endregion

    // #region internals

    #autoSpeedFactor = 0.0

    #mouseX = 0
    #mouseY = 0

    moveForward = false
    moveBackward = false
    moveLeft = false
    moveRight = false

    #mouseDragOn = false

    #incrementalVelocity = 1.0

    maxMovementSpeed = 2.0

    // #endregion

    // #region private variables
    
    #lat = 0;
    #lon = 0;

    #lookDirection = new Vector3();
    #spherical = new Spherical();
    #target = new Vector3();

    // #endregion

    #onMouseDown(event) {

        if (this.domElement !== document) {
            this.domElement.focus();
        }

        event.preventDefault();
        event.stopPropagation();

        if (this.captureMouse) this.domElement.requestPointerLock();

        this.#mouseDragOn = true;
    }

    #onMouseUp(event) {

        event.preventDefault();
        event.stopPropagation();

        document.exitPointerLock();

        this.#mouseDragOn = false;
    }

    #onMouseMove(event) {
        this.#mouseX = event.movementX;
        this.#mouseY = event.movementY;
    }

    #onKeyDown(event) {
        //event.preventDefault();

        if (!this.#mouseDragOn) return;

        switch (event.keyCode) {
            case 38: /*up*/
            case 87: /*W*/ this.moveForward = true; break;

            case 37: /*left*/
            case 65: /*A*/ this.moveLeft = true; break;

            case 40: /*down*/
            case 83: /*S*/ this.moveBackward = true; break;

            case 39: /*right*/
            case 68: /*D*/ this.moveRight = true; break;

            case 82: /*R*/ this.moveUp = true; break;
            case 70: /*F*/ this.moveDown = true; break;

            case 16: /*Shift*/ this.sprint = true; break;
        }
    }

    #onKeyUp(event) {
        switch (event.keyCode) {
            case 38: /*up*/
            case 87: /*W*/ this.moveForward = false; break;

            case 37: /*left*/
            case 65: /*A*/ this.moveLeft = false; break;

            case 40: /*down*/
            case 83: /*S*/ this.moveBackward = false; break;

            case 39: /*right*/
            case 68: /*D*/ this.moveRight = false; break;

            case 82: /*R*/ this.moveUp = false; break;
            case 70: /*F*/ this.moveDown = false; break;

            case 16: /*Shift*/ this.sprint = false; this.#incrementalVelocity = 1.0; break;
        }
    }

    lookAt(x, y, z) {
        if (x.isVector3) {
            this.#target.copy(x);
        } else {
            this.#target.set(x, y, z);
        }

        this.object.lookAt(this.#target);

        this.#setOrientation();

        return this;
    }

    #targetPosition = new Vector3();

    update(delta) {

        if (this.enabled === false) return;

        if (this.heightSpeed) {
            var y = MathUtils.clamp(this.object.position.y, this.heightMin, this.heightMax);
            var heightDelta = y - this.heightMin;

            this.#autoSpeedFactor = delta * (heightDelta * this.heightCoef);
        } else {
            this.#autoSpeedFactor = 0.0;
        }

        if (this.sprint) this.#incrementalVelocity += this.movementAcceleration;

        var actualMoveSpeed = Math.min(delta * this.movementSpeed * this.#incrementalVelocity, this.maxMovementSpeed);

        if (this.moveForward || (this.autoForward && !this.moveBackward)) this.object.translateZ(-(actualMoveSpeed + this.#autoSpeedFactor));
        if (this.moveBackward) this.object.translateZ(actualMoveSpeed);

        if (this.moveLeft) this.object.translateX(-actualMoveSpeed);
        if (this.moveRight) this.object.translateX(actualMoveSpeed);

        if (this.moveUp) this.object.position.y += actualMoveSpeed;
        if (this.moveDown) this.object.position.y -= actualMoveSpeed;

        var actualLookSpeed = /*delta * */ this.lookSpeed;

        if (!this.activeLook || !this.#mouseDragOn) {
            actualLookSpeed = 0;
        }

        var verticalLookRatio = 1;

        if (this.constrainVertical) {
            verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);
        }

        this.#lon -= this.#mouseX * actualLookSpeed;
        if (this.lookVertical) this.#lat -= this.#mouseY * actualLookSpeed * verticalLookRatio;

        this.#lat = Math.max(-85, Math.min(85, this.#lat));

        var phi = MathUtils.degToRad(90 - this.#lat);
        var theta = MathUtils.degToRad(this.#lon);

        if (this.constrainVertical) {
            phi = MathUtils.mapLinear(phi, 0, Math.PI, this.verticalMin, this.verticalMax);
        }

        var position = this.object.position;

        this.#targetPosition.setFromSphericalCoords(1, phi, theta).add(position);

        this.#mouseX = this.#mouseY = 0;

        this.object.lookAt(this.#targetPosition);
    }

    #onContextMenu(event) {
        event.preventDefault();
    }

    dispose() {
        this.domElement.removeEventListener('contextmenu', this.#onContextMenu, false);
        this.domElement.removeEventListener('mousedown', this.#mouseDown, false);
        this.domElement.removeEventListener('mousemove', this.#mouseMove, false);
        this.domElement.removeEventListener('mouseup', this.#mouseUp, false);

        window.removeEventListener('keydown', this.#keyDown, false);
        window.removeEventListener('keyup', this.#keyUp, false);
    }

    #mouseMove = this.#bind(this, this.#onMouseMove);
    #mouseDown = this.#bind(this, this.#onMouseDown);
    #mouseUp = this.#bind(this, this.#onMouseUp);
    #keyDown = this.#bind(this, this.#onKeyDown);
    #keyUp = this.#bind(this, this.#onKeyUp);

    #bind(scope, fn) {
        return function () {
            fn.apply(scope, arguments);
        };
    }

    #setOrientation() {
        var quaternion = this.object.quaternion;

        this.#lookDirection.set(0, 0, -1).applyQuaternion(quaternion);
        this.#spherical.setFromVector3(this.#lookDirection);

        this.#lat = 90 - MathUtils.radToDeg(this.#spherical.phi);
        this.#lon = MathUtils.radToDeg(this.#spherical.theta);
    }

}

module.exports = { FirstPersonEditorControls };