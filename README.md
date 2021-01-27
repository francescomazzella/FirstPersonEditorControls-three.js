# FirstPersonEditorControls

This class is an alternative implementation of [FirstPersonControls](https://threejs.org/docs/#examples/en/controls/FirstPersonControls), inspired by Unity's scene editor camera controls.

## Constructor

### FirstPersonEditorControls( object : [camera](https://threejs.org/docs/#api/en/cameras/Camera), domElement : [HTMLElement](https://developer.mozilla.org/it/docs/Web/API/HTMLElement) )

[object](https://threejs.org/docs/#api/en/cameras/Camera): The camera to be controlled.

[domElement](https://developer.mozilla.org/it/docs/Web/API/HTMLElement): The HTML element used for event listeners.

Creates a new instance of FirstPersonEditorControls.

## Properties

### .<a href="#activeLook" id="activeLook">activeLook</a> : Boolean

Whether or not it's possible to look around. Default is **true**.

### .<a href="#autoForward" id="autoForward">autoForward</a> : Boolean

Whether or not the camera is automatically moved forward. Default is **false**.

### .<a href="#captureMouse" id="captureMouse">captureMouse</a> : Boolean

Whether or not looking around locks the pointer. Default is **true**.

### .<a href="#constrainVertical" id="constrainVertical">constrainVertical</a> : Boolean

Whether or not looking around is vertically constrained by [<a href="#verticalMin">.verticalMin</a>, <a href="#verticalMax" >.verticalMax</a>]. Default is **false**.

### .<a href="#domElement" id="domElement">domElement</a> : [HTMLElement](https://developer.mozilla.org/it/docs/Web/API/HTMLElement)

The HTMLElement used to listen for mouse / touch events. This must be passed in the constructor; changing it here will not set up new event listeners.

### <a href="#enabled" id="enabled">enabled</a> : Boolean

Whether or not the controls are enabled. Default is **true**.

### <a href="#heightCoef" id="heightCoef">heightCoef</a> : Number

Determines how much faster the camera moves when it's y-component is near <a href="#heightMax">.heightMax</a>. Default is **1**.

### <a href="#heightMax" id="heightMax">heightMax</a> : Number

Upper camera height limit used for movement speed adjustment. Default is **1**.

### <a href="#heightMin" id="heightMin">heightMin</a> : Number

Lower camera height limit used for movement speed adjustment. Default is **0**.

### <a href="#heightSpeed" id="heightSpeed">heightSpeed</a> : Boolean

Whether or not the camera's height influences the forward movement speed. Default is **false**. Use the properties <a href="#heightCoef">.heightCoef</a>, <a href="#heightMin">.heightMin</a> and <a href="#heightMax">.heightMax</a> for configuration.

### <a href="#lookVertical" id="lookVertical">lookVertical</a> : Boolean

Whether or not it's possible to vertically look around. Default is **true**.

### <a href="#lookSpeed" id="lookSpeed">lookSpeed</a> : Number

The look around speed. Default is **0.005**.

### <a href="#maxMovementSpeed" id="maxMovementSpeed">maxMovementSpeed</a> : Number

The maximum movement speed, useful when sprint acceleration is enabled. Default is **2.0**.

### <a href="#movementAcceleration" id="movementAcceleration">movementAcceleration</a> : Number

The movement acceleration when sprinting. Default is **0.15**.

### <a href="#movementSpeed" id="movementSpeed">movementSpeed</a> : Number

The movement speed. Default is **1**.

### <a href="#object" id="object">object</a> : [Camera](https://threejs.org/docs/#api/en/cameras/Camera)

The camera to be controlled.

### <a href="#verticalMax" id="verticalMax">verticalMax</a> : Number

How far you can vertically look around, upper limit. Range is 0 to Math.PI radians. Default is **Math.PI**.

### <a href="#verticalMin" id="verticalMin">verticalMin</a> : Number

How far you can vertically look around, lower limit. Range is 0 to Math.PI radians. Default is **0**.

## Methods

### <a href="#dispose" id="dispose">dispose</a> () : null

Should be called if the controls is no longer required.

### .<a href="#lookAt" id="lookAt">lookAt</a> ( vector : [Vector3](https://threejs.org/docs/#api/en/math/Vector3) ) : FirstPersonEditorControls  
### .<a href="#lookAt">lookAt</a> ( x : Number, y : Number, z : Number ) : FirstPersonEditorControls

vector - A vector representing the target position.

Optionally, the x, y, z components of the world space position.

Ensures the controls orient the camera towards the defined target position.

### .<a href="#update" id="update">update</a> ( delta : Number ) : null

delta: Time delta value.

Updates the controls. Usually called in the animation loop.
