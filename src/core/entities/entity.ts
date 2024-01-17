import { UniqueEntityId } from './unique-entity-id'

// eslint-disable-next-line
export abstract class Entity<Props> {
  private _id: UniqueEntityId
  protected props: any

  get id() {
    return this._id
  }

  protected constructor(props: any, id?: UniqueEntityId) {
    this.props = props
    this._id = id ?? new UniqueEntityId()
  }

  public equals(entity: Entity<any>) {
    if (entity === this) return true

    if (entity.id === this.id) return true

    return false
  }
}
