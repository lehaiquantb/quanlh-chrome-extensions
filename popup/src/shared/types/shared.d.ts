type WebsiteSnapshotOut = import("../models/WebsiteStore").WebsiteSnapshotOut
type TNonEmptyObject =
  typeof import("mobx-state-tree/dist/types/complex-types/model").$nonEmptyObject
// type TKeyTool = keyof Omit<WebsiteSnapshotOut, TNonEmptyObject>
type TKeyTool = "figmaTool" | "stackoverflowTool"
