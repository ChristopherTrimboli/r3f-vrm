import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { mixamoVRMRigMap } from "./mixamoVRMRigMap";
import { VRM } from "../pixiv-three-vrm/packages/three-vrm/src/index";
import {
  AnimationClip,
  Quaternion,
  Vector3,
  QuaternionKeyframeTrack,
  VectorKeyframeTrack,
} from "three";

export async function loadMixamoAnimation(
  url: string,
  vrm: VRM
): Promise<AnimationClip> {
  const loader = new FBXLoader(); // A loader which loads FBX
  return loader.loadAsync(url).then((asset) => {
    const clip = AnimationClip.findByName(asset.animations, "mixamo.com"); // extract the AnimationClip

    // Disable root motion
    for (const track of clip.tracks) {
      if (track.name.includes(".position")) {
        clip.tracks = clip.tracks.filter((t) => t !== track);
      }
    }

    const tracks: any[] = []; // KeyframeTracks compatible with VRM will be added here

    const restRotationInverse = new Quaternion();
    const parentRestWorldRotation = new Quaternion();
    const _quatA = new Quaternion();
    const _vec3 = new Vector3();

    // Adjust with reference to hips height.
    const motionHipsHeight =
      asset?.getObjectByName("mixamorigHips")?.position.y;

    if (!vrm?.humanoid) {
      throw new Error("VRM humanoid is not found");
    }
    const vrmHipsY = vrm.humanoid
      ?.getNormalizedBoneNode("hips")
      ?.getWorldPosition(_vec3).y;

    if (vrmHipsY == null) {
      throw new Error("VRM hips is not found");
    }

    if (motionHipsHeight == null) {
      throw new Error("Motion hips is not found");
    }
    const vrmRootY = vrm.scene.getWorldPosition(_vec3).y;
    const vrmHipsHeight = Math.abs(vrmHipsY - vrmRootY);
    const hipsPositionScale = vrmHipsHeight / motionHipsHeight;

    clip.tracks.forEach((track) => {
      // Convert each tracks for VRM use, and push to `tracks`
      const trackSplitted = track.name.split(".");
      const mixamoRigName = trackSplitted[0];
      const vrmBoneName = (mixamoVRMRigMap as any)[mixamoRigName];
      const vrmNodeName =
        vrm.humanoid?.getNormalizedBoneNode(vrmBoneName)?.name;
      const mixamoRigNode = asset.getObjectByName(mixamoRigName);

      if (vrmNodeName != null) {
        const propertyName = trackSplitted[1];

        // Store rotations of rest-pose.
        if (!mixamoRigNode?.parent) {
          throw new Error("Parent of Mixamo rig node is not found");
        }
        mixamoRigNode.getWorldQuaternion(restRotationInverse).invert();
        mixamoRigNode.parent.getWorldQuaternion(parentRestWorldRotation);

        if (track instanceof QuaternionKeyframeTrack) {
          // Retarget rotation of mixamoRig to NormalizedBone.
          for (let i = 0; i < track.values.length; i += 4) {
            const flatQuaternion = track.values.slice(i, i + 4);

            _quatA.fromArray(flatQuaternion);

            // 親のレスト時ワールド回転 * トラックの回転 * レスト時ワールド回転の逆
            _quatA
              .premultiply(parentRestWorldRotation)
              .multiply(restRotationInverse);

            _quatA.toArray(flatQuaternion);

            flatQuaternion.forEach((v, index) => {
              track.values[index + i] = v;
            });
          }

          tracks.push(
            new QuaternionKeyframeTrack(
              `${vrmNodeName}.${propertyName}`,
              track.times,
              track.values.map((v, i) =>
                vrm.meta?.metaVersion === "0" && i % 2 === 0 ? -v : v
              )
            )
          );
        } else if (track instanceof VectorKeyframeTrack) {
          const value = track.values.map(
            (v, i) =>
              (vrm.meta?.metaVersion === "0" && i % 3 !== 1 ? -v : v) *
              hipsPositionScale
          );
          tracks.push(
            new VectorKeyframeTrack(
              `${vrmNodeName}.${propertyName}`,
              track.times,
              value
            )
          );
        }
      }
    });

    return new AnimationClip("vrmAnimation", clip.duration, tracks);
  });
}
