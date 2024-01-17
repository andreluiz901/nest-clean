import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityId } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  private aggregate: CustomAggregate // eslint-disable-line

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)
    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))
    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to evens', () => {
    const callBackSpy = vi.fn()
    // subscriber created listening callbackSpy
    DomainEvents.register(callBackSpy, CustomAggregateCreated.name)
    // event created not saving database
    const aggregate = CustomAggregate.create()
    // ensures event has been created but not dispatched
    expect(aggregate.domainEvents).toHaveLength(1)
    // Saving response event at database and letting event dispatch
    DomainEvents.dispatchEventsForAggregate(aggregate.id)
    // Subscriber listen event and do what should be don
    expect(callBackSpy).toBeCalled()
    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
