const { useState } = require("react");

export const useThrowAsyncError = () => {
  const [, setState] = useState();

  return (error) => {
    setState(() => {
      throw error;
    });
  };
};
