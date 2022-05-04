import { loadGLTF } from "./lib/loader.js";
const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
    const start = async () => {
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: './assets/markers/targetsGalaxy.mind',
            maxTrack: 4
        });

        const { renderer, scene, camera } = mindarThree;

        const geometry_0 = new THREE.PlaneGeometry(1, 1);
        const material_0 = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });
        const plane_0 = new THREE.Mesh(geometry_0, material_0);

        const geometry_1 = new THREE.PlaneGeometry(1, 1);
        const material_1 = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 });
        const plane_1 = new THREE.Mesh(geometry_1, material_1);

        const geometry_2 = new THREE.PlaneGeometry(1, 1);
        const material_2 = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.5 });
        const plane_2 = new THREE.Mesh(geometry_2, material_2);

        const geometry_3 = new THREE.PlaneGeometry(1, 1);
        const material_3 = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
        const plane_3 = new THREE.Mesh(geometry_3, material_3);



        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        scene.add(light);

        const galaxy = await loadGLTF('./assets/models/galaxy/scene.gltf');
        galaxy.scene.scale.set(1, 1, 1);
        galaxy.scene.position.set(0, -0.4, 0);

        const jupiter = await loadGLTF('./assets/models/jupiter/Untitled.gltf');
        jupiter.scene.scale.set(0.6, 0.6, 0.6);
        jupiter.scene.position.set(0, -0.4, 0);

        const moon = await loadGLTF('./assets/models/moon/Untitled.gltf');
        moon.scene.scale.set(1, 1, 1);
        moon.scene.position.set(0, -0.4, 0);

        const saturn = await loadGLTF('./assets/models/saturn/scene.gltf');
        saturn.scene.scale.set(0.1, 0.1, 0.1);
        saturn.scene.position.set(0, -0.4, 0);

        const anchor_0 = mindarThree.addAnchor(0);
        anchor_0.group.add(galaxy.scene);

        const anchor_1 = mindarThree.addAnchor(1);
        anchor_1.group.add(jupiter.scene);

        const anchor_2 = mindarThree.addAnchor(2);
        anchor_2.group.add(moon.scene);

        const anchor_3 = mindarThree.addAnchor(3);
        anchor_3.group.add(saturn.scene);

        const mixer_galaxy = new THREE.AnimationMixer(galaxy.scene);
        const action_galaxy = mixer_galaxy.clipAction(galaxy.animations[0]);
        action_galaxy.play();

        const clock = new THREE.Clock();

        await mindarThree.start();
        renderer.setAnimationLoop(() => {
            const delta = clock.getDelta();
            jupiter.scene.rotation.set(0, jupiter.scene.rotation.y + delta, 0);
            mixer_galaxy.update(delta);
            moon.scene.rotation.set(0, moon.scene.rotation.y + delta, 0);
            saturn.scene.rotation.set(0, saturn.scene.rotation.y + delta, 0);
            renderer.render(scene, camera);
        });
    }
    start();
})