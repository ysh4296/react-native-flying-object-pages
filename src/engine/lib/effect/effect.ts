import RigidBody from '@rigidbody/rigidbody';
import Shape from '../rigidbody/shape';

export default class Effect extends RigidBody {
  constructor(shape: Shape, mass: number) {
    super(shape, mass);
  }

  applyEffect(object: RigidBody) {}
}
