import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface VoteSliceState {
    votes: Record<string, Record<string, number | null>>;
}

interface VoteChange {
    questionId: string;
    optionId: string;
    change: 1 | -1;
}

interface VoteRegister {
    questionId: string;
    questionSlugs: string[];
}

const voteSlice = createSlice({
    name: "vote",
    initialState: {
        votes: {},
    },
    reducers: {
        registerVote: (
            state: VoteSliceState,
            action: PayloadAction<VoteRegister>,
        ) => {
            state.votes[action.payload.questionId] = {};
            action.payload.questionSlugs.forEach((value) => {
                state.votes[action.payload.questionId][value] = null;
            });
        },
        changeVote: (
            state: VoteSliceState,
            action: PayloadAction<VoteChange>,
        ) => {
            const foundVote =
                state.votes[action.payload.questionId][action.payload.optionId];

            if (foundVote !== null) {
                if (foundVote === 1 && action.payload.change <= 0) {
                    return;
                }
                if (
                    foundVote >=
                        Object.keys(state.votes[action.payload.questionId])
                            .length &&
                    action.payload.change >= 0
                ) {
                    state.votes[action.payload.questionId][
                        action.payload.optionId
                    ] = null;
                    return;
                }
                state.votes[action.payload.questionId][
                    action.payload.optionId
                ] += action.payload.change;
            } else {
                if (action.payload.change <= 0) {
                    state.votes[action.payload.questionId][
                        action.payload.optionId
                    ] = Object.keys(
                        state.votes[action.payload.questionId],
                    ).length;
                }
            }
        },
    },
});

export const { registerVote, changeVote } = voteSlice.actions;

export default voteSlice.reducer;
