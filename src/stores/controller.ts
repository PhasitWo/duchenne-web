import { create, StateCreator } from "zustand";

export interface ControllerState {
    currentController: AbortController | null;
    getNewController: () => AbortController;
}

export const createWithBaseController = <T>(additionalSteps: StateCreator<T & ControllerState, [], [], T>) => {
    return create<T & ControllerState>()((set, get, store) => ({
        currentController: null,
        getNewController: () => {
            const oldController = get().currentController;
            if (oldController) {
                oldController.abort();
            }
            const newController = new AbortController();
            set((state) => ({ ...state, currentController: newController }));
            return newController;
        },
        ...additionalSteps(set, get, store),
    }));
};
