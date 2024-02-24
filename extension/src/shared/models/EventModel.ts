import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

export const EventModel = types.model("EventModel").props({
  id: types.string,
  type: types.string,
  params: types.optional(types.frozen<any>(), {}),
  response: types.optional(types.frozen<any>(), {}),
})

export type Event = Instance<typeof EventModel>
export type EventSnapshotOut = SnapshotOut<typeof EventModel>
export type EventSnapshotIn = SnapshotIn<typeof EventModel>
export type EventSnapshot = SnapshotOut<typeof EventModel>
