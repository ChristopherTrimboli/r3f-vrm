import type * as THREE from 'three';
import { VRMCoreParameters } from '../../three-vrm-core/src';
import { VRMSpringBoneManager } from '../../three-vrm-springbone/src';
import { VRMNodeConstraintManager } from '../../three-vrm-node-constraint/src';

/**
 * Parameters for a {@link VRM} class.
 */
export interface VRMParameters extends VRMCoreParameters {
  materials?: THREE.Material[];
  springBoneManager?: VRMSpringBoneManager;
  nodeConstraintManager?: VRMNodeConstraintManager;
}
