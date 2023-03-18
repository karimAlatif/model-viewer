import * as BABYLON from "babylonjs";
import "babylonjs-loaders";

export default class LoaderManager {
  constructor(sceneManager) {
    this.game = sceneManager.game;
    this.scene = sceneManager.scene;
    this.mirror = sceneManager.mirror;
    this.shadowGenerator = sceneManager.shadowGenerator;
    this.sceneManager = sceneManager;
    this.assetsManager = new BABYLON.AssetsManager(this.scene);
  }

  load3dModel(onFinish) {
    let model_task = this.assetsManager.addMeshTask(
      "model_task",
      "",
      `./models/test/`,
      `901117.gltf`
    );
    model_task.onSuccess = (task) => {
      let rootMesh = task.loadedMeshes.find((mesh) => mesh.name === "__root__");
      rootMesh.scaling = new BABYLON.Vector3(30, 30, -30);
      rootMesh.position.y = -217.5;
      this.sceneManager.currentCart = rootMesh;

      for (let j = 0; j < task.loadedMeshes.length; j++) {
        let mesh = task.loadedMeshes[j];
        this.mirror.renderList.push(mesh);
        this.shadowGenerator.getShadowMap().renderList.push(mesh);
        this.shadowGenerator.addShadowCaster(mesh, true);
      }
    };

    this.assetsManager.onProgress = (
      remainingCount,
      totalCount,
      lastFinishedTask
    ) => {
      this.game.engine.loadingUIText =
        "loading Assets " +
        remainingCount +
        " out of " +
        totalCount +
        " items still need to be loaded.";
    };

    this.assetsManager.onFinish = (tasks) => {
      // console.log("doneeeeeee");
      // this.sceneManager.assignScaleAnimation(
      //   this.sceneManager.currentCart,
      //   () => { }
      // );
    };
    // Start loading
    this.assetsManager.load();
  }
}

// for (let j = 0; j < task.loadedMeshes.length; j++) {
//     console.log(task.loadedMeshes[j].name, "   ", j);
// }
