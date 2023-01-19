import * as BABYLON from "babylonjs";
import LoaderManager from "./LoaderManager";
import "pepjs";
import "babylonjs-inspector";
import "babylonjs-loaders";

export default class StudioSceneManager {
  constructor(game) {
    this.game = game;
    //Main Props
    this.scene = null;
    this.studioGui = null;
    this.mainCamera = null;
    this.pipline = null;

    //Input Manager
    this.InputMg = {
      isDragging: false,
      startPoint: null,
      currentTouchedMesh: null,
      currentSelectedMesh: null,
      MeshIndex: 0,
      dragLimitation: null,
      currentMeshDevOpts: null,
    };
  }

  //#region  MainSceneProperties
  CreateScene() {
    //Create Bts Scene
    //Create Scene
    this.scene = new BABYLON.Scene(this.game.engine);
    this.scene.clearColor = new BABYLON.Color4(210 / 255, 210 / 255, 210 / 255, 1);
    // this.scene.imageProcessingConfiguration.colorCurvesEnabled = true;
    // this.scene.imageProcessingConfiguration.colorCurves = new BABYLON.ColorCurves();
    // this.scene.imageProcessingConfiguration.colorCurves.globalSaturation = 0;
    this.scene.imageProcessingConfiguration.contrast = 2.35;
    this.scene.imageProcessingConfiguration.exposure = 1.45;
    this.scene.imageProcessingConfiguration.vignetteEnabled = true;

    // this.scene.debugLayer.show();
    // this.scene.onPointerObservable.add((pointerInfo) => {
    //   switch (pointerInfo.type) {
    //     case BABYLON.PointerEventTypes.POINTERDOWN:
    //       this.onPointerDown(pointerInfo.event);
    //       break;
    //     case BABYLON.PointerEventTypes.POINTERUP:
    //       this.onPointerUp(pointerInfo.event);
    //       break;
    //     case BABYLON.PointerEventTypes.POINTERMOVE:
    //       this.onPointerMove(pointerInfo.event);
    //       break;
    //     case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
    //       if (this.InputMg.currentSelectedMesh) {
    //         //Item Selected Before
    //         this.InputMg.currentSelectedMesh.showBoundingBox = false;
    //       }
    //       break;
    //     case BABYLON.PointerEventTypes.POINTERWHEEL:
    //       this.MouseWheelHandler();
    //       break;
    //     default:
    //       break;
    //   }
    // });

    //Installation
    this.createCamera();
    this.setUpEnvironMent();

    const onFinish = () => {
      console.log("Finish loading Model !");
    };

    //Create LoadManager instance
    this.loaderManager = new LoaderManager(this);
    this.loaderManager.load3dModel(onFinish);

    return this.scene;
  }
  createCamera() {
    this.mainCamera = new BABYLON.ArcRotateCamera(
      "ArcCamera",
      2.0,
      1.28,
      60.5,
      new BABYLON.Vector3(0, 15, 0),
      this.scene
    );
    this.mainCamera.attachControl(this.game.canvas, true);

    this.mainCamera.lowerRadiusLimit = 35;
    this.mainCamera.upperRadiusLimit = 85;

    this.mainCamera.lowerBetaLimit = 0.2;
    this.mainCamera.upperBetaLimit = 1.5;

    this.mainCamera.minZ = 0.2;
    // this.mainCamera.target = new BABYLON.Vector3(0, 1.5, -0.0);
    this.mainCamera.beta = 1.44;

    this.mainCamera.wheelPrecision = 20;
    this.mainCamera.useBouncingBehavior = true;

    this.staticCamera = new BABYLON.ArcRotateCamera(
      "staticCamera",
      2.0,
      1.28,
      6.5,
      new BABYLON.Vector3(0, 0, 0),
      this.scene
    );
    this.staticCamera.target = new BABYLON.Vector3(0, 1.5, -0.0);
  }
  setUpEnvironMent() {
    // let hemiLight = new BABYLON.HemisphericLight(
    //   "HemiLight",
    //   new BABYLON.Vector3(0.3, 1, -0.3),
    //   this.scene
    // );
    // hemiLight.intensity = 1;

    let dirLight = new BABYLON.DirectionalLight(
      "DirectionalLight",
      new BABYLON.Vector3(0, -1, 0.3),
      this.scene
    );
    dirLight.position = new BABYLON.Vector3(3, 9, 3);

    this.alphaMaterial = new BABYLON.StandardMaterial("alphaMat", this.scene);
    this.alphaMaterial.alpha = 0;

    // ShadowGenerator
    this.shadowGenerator = new BABYLON.ShadowGenerator(512, dirLight);
    this.shadowGenerator.useBlurExponentialShadowMap = true;
    this.shadowGenerator.filteringQuality =
      BABYLON.ShadowGenerator.QUALITY_HIGH;
    this.shadowGenerator.blurScale = 64;
    this.shadowGenerator.setDarkness(3);

    dirLight.intensity = 0.1;
    dirLight.shadowMinZ = 0;
    dirLight.shadowMaxZ = 700;

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    let ground = BABYLON.Mesh.CreateGround("ground1", 90, 90, 250, this.scene);
    ground.receiveShadows = true;

    // Create and tweak the background material.
    var backgroundMaterial = new BABYLON.BackgroundMaterial(
      "backgroundMaterial",
      this.scene
    );
    backgroundMaterial.diffuseTexture = new BABYLON.Texture(
      "./Textuers/scene/backgroundGround.png",
      this.scene
    );
    backgroundMaterial.diffuseTexture.hasAlpha = true;
    backgroundMaterial.opacityFresnel = false;
    backgroundMaterial.shadowLevel = 1;
    backgroundMaterial.alpha = 0.65;

    //Create CubicTexture
    let skyboxCubecTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
      "./environment/empty_warehouse_01_4k.env",
      this.scene
    );
    this.scene.environmentTexture = skyboxCubecTexture;
    this.scene.environmentTexture.level = 1;
    this.scene.environmentTexture.rotationY = 1.482;
    this.scene.environmentIntensity = .45;
    
    //Mirror
    this.mirror = new BABYLON.MirrorTexture("mirror", 512, this.scene);
    this.mirror.mirrorPlane = new BABYLON.Plane(0, -1, 0, 0);
    this.mirror.adaptiveBlurKernel = 32;
    // this.Groundmirror.mirrorPlane = new BABYLON.Plane(0, -.69, -0, -1);
    backgroundMaterial.reflectionTexture = this.mirror;
    backgroundMaterial.reflectionFresnel = true;
    backgroundMaterial.reflectionStandardFresnelWeight = 0.85;
    backgroundMaterial.reflectionTexture.level = .85;
    ground.material = backgroundMaterial;
  }
  //#endregion

  //region SceneActions
  loadCartData(cartData, onFinish) {
    // console.log("Trying !!");
    if (this.selectedCatData) {
      const {
        width: prevWidth,
        height: prevHeight,
        type: prevType,
        exteriorColor: prevExteriorColor,
        drawersColor: prevDrawersColor,
        locker: prevLockers,
        drawers: prevDrawers,
      } = this.selectedCatData;
      const {
        width,
        height,
        type,
        exteriorColor,
        drawersColor,
        locker,
        drawers,
      } = cartData;
      console.log("locker", locker);
      if (prevWidth !== width || prevHeight !== height || prevType !== type) {
        //Need To Load New Mesh
        // console.log("load new Model!!");
        this.loaderManager.load3dModel(cartData, onFinish);
      } else if (exteriorColor !== prevExteriorColor) {
        //Need To Change The Color
        // console.log("Change The main Color !!");
        this.applyCartColor(exteriorColor);
        onFinish();
      } else if (drawersColor !== prevDrawersColor) {
        //Need To Change The Color
        // console.log("Change The Drawer Color !!");
        this.applyDrawerColor(drawersColor);
        onFinish();
      } else if (locker.id !== prevLockers.id) {
        // console.log("Change locker !!");
        this.attachLockers(locker);
        onFinish();
      } else {
        // console.log("Another Case !!!! !!");
        onFinish();
      }
    } else {
      //Load First Time
      // console.log("load FIRST !!");
      this.loaderManager.load3dModel(cartData, onFinish);
      this.applyDrawerColor(cartData.drawersColor);
    }
    this.selectedCatData = cartData;
  }
  //#endregion
  //#region UserInput (Mouse)
  onPointerDown(ev) { }
  onPointerUp(ev) { }
  onPointerMove(ev) { }
  MouseWheelHandler(ev) { }
  //#endregion

  //#region Animations
  assignScaleAnimation(targetObj, onFinish) {
    targetObj.animations = [];
    var scaleAnimation = new BABYLON.Animation(
      "scaleAnimation",
      "scaling",
      300,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    var keys = [];

    keys.push({
      frame: 0,
      value: targetObj.scaling.clone(),
    });

    keys.push({
      frame: 50,
      value: new BABYLON.Vector3(1 * 1.4, 1 * 1.4, -1 * 1.4),
    });

    keys.push({
      frame: 100,
      value: new BABYLON.Vector3(1, 1, -1),
    });

    scaleAnimation.setKeys(keys);
    targetObj.animations.push(scaleAnimation);
    this.scene.beginAnimation(targetObj, 0, 100, false, 1, () => {
      if (onFinish) onFinish();
    });
  }
  //#endregion
}
