import { loadGLTF, loadAudio } from "./lib/loader.js";
import { RGBA_ASTC_10x5_Format } from "./lib/three.js-r132/build/three.module.js";
const THREE = window.MINDAR.IMAGE.THREE;

const sideBarWidth = "600px";
const openNav = () => {
    document.getElementById("code-container").style.width = sideBarWidth;
    document.getElementById("main").style.marginRight = sideBarWidth;
}

const openbtn = document.getElementById("openbtn");
openbtn.addEventListener("click", openNav);

const closeNav = () => {
    document.getElementById("code-container").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
}

const closebtn = document.getElementById("closebtn");
closebtn.addEventListener("click", closeNav);

const scene_1 = new THREE.Scene();
const scene_2 = new THREE.Scene();
const scene_3 = new THREE.Scene();

//AR scene
const start = async () => {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    });
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
        container: document.querySelector("#ar-container"),
        imageTargetSrc: './assets/markers/targetsFashion.mind',
        maxTrack: 5,
        uiScanning: "no"
    });

    const { renderer, scene, camera } = mindarThree;



    const width = 1;
    const height = 1;
    const depth = 1;

    //0_base
    const geometry_0_base = new THREE.PlaneGeometry(1, 1);
    const material_0_base = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 1 });
    const plane_0_base = new THREE.Mesh(geometry_0_base, material_0_base);
    //0_top
    const geometry_0_top = new THREE.PlaneGeometry(1, 1, 32, 32);
    //const material_0_top = new THREE.MeshNormalMaterial({ wireframe: true });

    //load audio
    const listener = new THREE.AudioListener();
    camera.add(listener);
    const sound = new THREE.Audio(listener);
    const audioClip = await loadAudio('./assets/sound/soundsample.ogg');
    const audioClip2 = await loadAudio('./assets/sound/cellosample2.mp3');
    const audio = new THREE.PositionalAudio(listener);
    const audio2 = new THREE.PositionalAudio(listener);

    // const geo_cube_0 = new THREE.ConeGeometry(0.5, 1, 10, 20);
    // const material_test = new THREE.MeshNormalMaterial({ color: 0xffff00, transparent: true, opacity: 0.8, wireframe: true });
    // const cube_0 = new THREE.Mesh(geo_cube_0, material_test);
    // scene_1.add(cube_0);

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

    const raccoon = await loadGLTF('./assets/models/musicband-raccoon/scene.gltf');
    raccoon.scene.scale.set(0.1, 0.1, 0.1);
    raccoon.scene.position.set(0, -0.4, 0);

    const bear = await loadGLTF('./assets/models/musicband-bear/scene.gltf');
    bear.scene.scale.set(0.1, 0.1, 0.1);
    bear.scene.position.set(0, -0.4, 0);

    const anchor_0 = mindarThree.addAnchor(0);
    anchor_0.group.add(plane_0_base);

    anchor_0.group.add(audio);
    //anchor_0.group.add(cube_0);
    audio.setRefDistance(5000)
    audio.setBuffer(audioClip);
    audio.setVolume(1);
    audio.setLoop(true);
    const analyser = new THREE.AudioAnalyser(audio, 128);

    const format = (renderer.capabilities.isWebGL2) ? THREE.RedFormat : THREE.LuminanceFormat;
    const uniforms = {
        tAudioData: { value: new THREE.DataTexture(analyser.data) },
        u_time: { type: "f", value: 1.0 },
        colorB: { type: "vec3", value: new THREE.Color(0xfff000) },
        colorA: { type: "vec3", value: new THREE.Color(0xffffff) },
    };

    // const uniforms = {

    //     tAudioData: { value: new THREE.DataTexture(analyser.data) }

    // };

    const uniforms1 = {
        u_time: {
            type: "f",
            value: 1.0,
        },
        u_amplitude: {
            type: "f",
            value: 1.0,
        },
        u_data_arr: {
            type: "float[64]",
            value: analyser.data,
        },
    };

    const vShader = `
        varying float x;
        varying float y;
        varying float z;
        varying vec3 vUv;
        uniform float u_time;
        uniform float u_amplitude;
        uniform float[64] u_data_arr;
        void main() {
            vUv = position;
            x = abs(position.x)*64.0;
            y = abs(position.y)*64.0;
            float floor_x = round(x);
            float floor_y = round(y);
            float x_multiplier = (32.0 - x) / 8.0;
            float y_multiplier = (32.0 - y) / 8.0;
            z = sin(u_data_arr[int(floor_x)]/300.0 + u_data_arr[int(floor_y)]/300.0) * u_amplitude;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, z, 1.0);
        }
    `

    const fShader = `
        varying float x;
        varying float y;
        varying float z;
        varying vec3 vUv;
        uniform float u_time;
        void main() {
            gl_FragColor = vec4((32.0 - abs(x)) / 32.0, (32.0 - abs(y)) / 32.0, (abs(x + y) / 2.0) / 32.0, 1.0);
        }
    `

    const material_0_top = new THREE.ShaderMaterial({
        uniforms: uniforms1,
        vertexShader: vShader,
        fragmentShader: fShader,
        wireframe: true
    });

    const plane_0_top = new THREE.Mesh(geometry_0_top, material_0_top);
    anchor_0.group.add(plane_0_top);

    anchor_0.onTargetFound = () => {
        audio.play();
        //sound.play();
        // create an AudioAnalyser, passing in the sound and desired fftSize
        //const analyser = new THREE.AudioAnalyser(audio, 128);

        // get the average frequency of the sound
        const data = analyser.getFrequencyData();
        console.log(data);
    }
    anchor_0.onTargetLost = () => {
        audio.pause();
    }
    const anchor_1 = mindarThree.addAnchor(1);
    anchor_1.group.add(plane_1);
    anchor_1.group.add(scene_1);

    const anchor_2 = mindarThree.addAnchor(2);
    anchor_2.group.add(plane_2);
    anchor_2.group.add(scene_2);

    const anchor_3 = mindarThree.addAnchor(3);
    anchor_3.group.add(plane_3);
    anchor_3.group.add(scene_3);

    const anchor_A = mindarThree.addAnchor(4);
    anchor_A.group.add(raccoon.scene);

    const anchor_B = mindarThree.addAnchor(5);
    anchor_B.group.add(bear.scene);

    const mixer_A = new THREE.AnimationMixer(raccoon.scene);
    const action_A = mixer_A.clipAction(raccoon.animations[0]);
    action_A.play();
    anchor_A.group.add(audio);
    anchor_A.onTargetFound = () => {
        audio.play();
        const data = analyser.getFrequencyData();
        console.log(data);
    }
    anchor_A.onTargetLost = () => {
        audio.pause();
    }

    const mixer_B = new THREE.AnimationMixer(bear.scene);
    const action_B = mixer_B.clipAction(bear.animations[0]);
    action_B.play();
    anchor_B.group.add(audio2);
    audio2.setRefDistance(5000)
    audio2.setBuffer(audioClip2);
    audio2.setVolume(1);
    audio2.setLoop(true);
    anchor_B.onTargetFound = () => {
        audio2.play();
    }
    anchor_B.onTargetLost = () => {
        audio2.pause();
    }

    const clock = new THREE.Clock();

    await mindarThree.start();

    //animation
    const tick = (time) => {
        const delta = clock.getDelta();
        uniforms1.u_time.value = time;
        analyser.getFrequencyData();
        uniforms.tAudioData.value.needsUpdate = true;
        uniforms1.u_data_arr.value.needsUpdate = true;
        //console.log(uniforms);
        //const random = Math.random(-5, 5);
        raccoon.scene.rotation.set(0, raccoon.scene.rotation.y + delta, 0);
        //cube_0.scale.set(1, 1, cube_0.scale.z + delta);
        mixer_A.update(delta);
        bear.scene.rotation.set(0, bear.scene.rotation.y + delta, 0);
        mixer_B.update(delta);
        //console.log(analyser.getFrequencyData());
        renderer.render(scene, camera);
        requestAnimationFrame(tick)
    }

    tick();
}

start();


//codemirror
window.CodeMirror.keyMap.live = {
    fallthrough: "default",
    "Ctrl-Enter": function (cm) {
        const obj = getSelectionCodeColumn(cm, false);
        //eval(obj.code);
        setComp(obj.code);
        flash(cm, obj.selection);
    }
};

const cm = new window.CodeMirror(document.querySelector("#editorA"), {
    lineNumbers: true,
    autofocus: true,
    mode: "javascript",
    keyMap: "live",
    value: ''
});

function getSelectionCodeColumn(cm, findBlock) {
    let pos = cm.getCursor(),
        text = null;

    if (!findBlock) {
        text = cm.getDoc().getSelection();

        if (text === "") {
            text = cm.getLine(pos.line);
        } else {
            pos = { start: cm.getCursor("start"), end: cm.getCursor("end") };
            //pos = null
        }
    } else {
        let startline = pos.line,
            endline = pos.line,
            pos1,
            pos2,
            sel;

        while (startline > 0 && cm.getLine(startline) !== "") {
            startline--;
        }
        while (endline < cm.lineCount() && cm.getLine(endline) !== "") {
            endline++;
        }

        pos1 = { line: startline, ch: 0 };
        pos2 = { line: endline, ch: 0 };

        text = cm.getRange(pos1, pos2);

        pos = { start: pos1, end: pos2 };
    }

    if (pos.start === undefined) {
        let lineNumber = pos.line,
            start = 0,
            end = text.length;

        pos = {
            start: { line: lineNumber, ch: start },
            end: { line: lineNumber, ch: end }
        };
    }

    return { selection: pos, code: text };
}

const flash = function (cm, pos) {
    let sel,
        cb = function () {
            sel.clear();
        };

    if (pos !== null) {
        if (pos.start) {
            // if called from a findBlock keymap
            sel = cm.markText(pos.start, pos.end, {
                className: "CodeMirror-highlight"
            });
        } else {
            // called with single line
            sel = cm.markText(
                { line: pos.line, ch: 0 },
                { line: pos.line, ch: null },
                { className: "CodeMirror-highlight" }
            );
        }
    } else {
        // called with selected block
        sel = cm.markText(cm.getCursor(true), cm.getCursor(false), {
            className: "CodeMirror-highlight"
        });
    }

    window.setTimeout(cb, 250);
};

function setComp(code) {
    //alert("alert");
    eval(code);
}