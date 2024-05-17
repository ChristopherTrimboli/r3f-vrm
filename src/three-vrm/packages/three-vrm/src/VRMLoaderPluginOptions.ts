import type * as THREE from 'three';
import type {
  VRMExpressionLoaderPlugin,
  VRMFirstPersonLoaderPlugin,
  VRMHumanoidLoaderPlugin,
  VRMLookAtLoaderPlugin,
  VRMMetaLoaderPlugin,
} from '../../three-vrm-core/src';
import type { MToonMaterialLoaderPlugin } from '../../three-vrm-materials-mtoon/src';
import type { VRMMaterialsHDREmissiveMultiplierLoaderPlugin } from '../../three-vrm-materials-hdr-emissive-multiplier/src';
import type { VRMMaterialsV0CompatPlugin } from '../../three-vrm-materials-v0compat/src';
import type { VRMNodeConstraintLoaderPlugin } from '../../three-vrm-node-constraint/src';
import type { VRMSpringBoneLoaderPlugin } from '../../three-vrm-springbone/src';

export interface VRMLoaderPluginOptions {
  expressionPlugin?: VRMExpressionLoaderPlugin;
  firstPersonPlugin?: VRMFirstPersonLoaderPlugin;
  humanoidPlugin?: VRMHumanoidLoaderPlugin;
  lookAtPlugin?: VRMLookAtLoaderPlugin;
  metaPlugin?: VRMMetaLoaderPlugin;
  mtoonMaterialPlugin?: MToonMaterialLoaderPlugin;
  materialsHDREmissiveMultiplierPlugin?: VRMMaterialsHDREmissiveMultiplierLoaderPlugin;
  materialsV0CompatPlugin?: VRMMaterialsV0CompatPlugin;
  springBonePlugin?: VRMSpringBoneLoaderPlugin;
  nodeConstraintPlugin?: VRMNodeConstraintLoaderPlugin;

  /**
   * If assigned, the object will be used as a helper root of every component.
   * Useful for debug.
   * Will be overwritten if you use custom loader plugins for each components.
   */
  helperRoot?: THREE.Object3D;

  /**
   * Whether it copies pose from normalizedHumanBones to rawHumanBones on {@link update}.
   * `true` by default.
   *
   * @default true
   */
  autoUpdateHumanBones?: boolean;
}
