
import { useContext } from "react";
import AgentClientContext from "./AgentClientContext";

export function useAgentClient() {
  const context = useContext(AgentClientContext);

  if (context === null) {
    throw new Error(
      "useAgentClient must be used inside AgentClientProvider"
    );
  }

  return context;
}

