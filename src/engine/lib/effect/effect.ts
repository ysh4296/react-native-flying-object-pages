import RigidBody from '../rigidbody';
import Shape from '../shape';

export default class Effect extends RigidBody {
  constructor(shape: Shape, mass: number) {
    super(shape, mass);
  }

  applyEffect(object: RigidBody) {}
}
