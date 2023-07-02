import useErrorHandler from "#src/shared/error/useErrorHandler";
import { startCallingApi, endCallingApi } from "#src/shared/layoutSlice";
import { useDispatch } from "react-redux";

class apiHandler {
  constructor(errorHandler, dispatch) {
    this.errorHandler = errorHandler;
    this.dispatch = dispatch;
  }

  async call(method, path, data = null, returnFullResponse = false) {
    try {
      const headers = { "Content-Type": "application/json" };

      this.dispatch(startCallingApi());
      const res = await fetch(path, {
        body: data ? JSON.stringify(data) : null,
        headers,
        method: method,
      });
      console.log("res", res.status);
      if (res.status !== 200) {
        throw Error("API CALL ERROR");
      }

      const json = await res.json();
      if (json.error) {
        const internalAPIError = new Error(
          json.internalMessage || "Failed to fetch API"
        );
        this.errorHandler(
          internalAPIError,
          ["api-call-internal-error"],
          {
            request: { method, path, data },
          },
          false
        );
        throw internalAPIError;
      }

      this.dispatch(endCallingApi());

      return returnFullResponse ? json : json.data;
    } catch (error) {
      this.errorHandler(
        error,
        ["api-call-error"],
        {
          request: { method, path, data },
        },
        false
      );
      this.dispatch(endCallingApi());
      throw error;
    }
  }
}
export const useApi = () => {
  const errorHandler = useErrorHandler();
  const dispatch = useDispatch();
  return new apiHandler(errorHandler, dispatch);
};
