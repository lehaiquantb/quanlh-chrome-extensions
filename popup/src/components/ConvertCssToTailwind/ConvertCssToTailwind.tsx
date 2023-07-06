import { getRuntimeEnvironment } from "@/shared";
import { useStores } from "@/shared/models";
import { observer } from "mobx-react-lite";
import React, { FC, useEffect } from "react";

type Props = {};

const ConvertCssToTailwind: FC<Props> = observer((props: Props) => {
  const { startAt, setStartAt } = useStores();

  useEffect(() => {
    console.log(getRuntimeEnvironment());
  }, []);
  return (
    <div>
      {startAt}
      <button
        onClick={() => {
          setStartAt(Math.random().toString());
        }}
      >
        Trigger
      </button>
    </div>
  );
});

ConvertCssToTailwind.defaultProps = {};

export default ConvertCssToTailwind;
