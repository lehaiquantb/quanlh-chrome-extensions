import React from "react"
import { useInitialRootStore } from "./models"

// eslint-disable-next-line @typescript-eslint/ban-types
type WithStorageProps = {}

// HOC that adds a "name" prop to the wrapped component
const withStorage = <P extends WithStorageProps>(WrappedComponent: React.ComponentType<P>) => {
  const WithStorage: React.FC<P> = (props?: P) => {
    const { rehydrated } = useInitialRootStore(() => {
      // console.log("rehydrated")
    })

    if (!rehydrated) {
      return null
    }

    return <WrappedComponent {...(props as P)} />
  }
  return WithStorage
}

export default withStorage
