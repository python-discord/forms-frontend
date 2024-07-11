/** @jsx jsx */
import { jsx, css } from "@emotion/react";

import React, { useEffect, useState } from "react";
import RenderedQuestion from "../Question";
import { slugify, humanize } from "../../utils";
import colors from "../../colors";
import { useDispatch, useSelector } from "react-redux";
import { registerVote, changeVote, VoteSliceState } from "../../slices/votes";
import FlipMove from "react-flip-move";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";

interface VoteProps {
    options: Array<string>;
    valid: boolean;
    question: React.RefObject<RenderedQuestion>;
    questionId: string;
    handler: (event: Record<string, number | null>) => void;
}

const baseCardStyles = css`
    display: flex;
    align-items: center;
    background-color: ${colors.darkerGreyple};
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 10px;
`;

const buttonStyles = css`
    border: none;
    background: ${colors.greyple};
    cursor: pointer;
    margin-right: 20px;
    margin-left: 20px;
    border-radius: 5px;
    transition: transform 0.1s ease;
    transform: none;

    :hover {
        transform: scale(1.1);
    }
`;

const iconStyles = css`
    font-size: 2em;
    color: white;
`;

const markerStyles = css`
    border-radius: 5px;
    padding: 5px;
    margin-right: 10px;
`;

const votingStyles = css`
    button {
        background-color: ${colors.darkerBlurple};
    }
`;

const Buttons = (base: { questionId: string; optionId: string }) => {
    const dispatch = useDispatch();

    return (
        <div>
            <button
                type="button"
                css={buttonStyles}
                onClick={() => dispatch(changeVote({ ...base, change: -1 }))}
            >
                <FontAwesomeIcon css={iconStyles} icon={faCaretUp} />
            </button>
            <button
                type="button"
                css={buttonStyles}
                onClick={() => dispatch(changeVote({ ...base, change: +1 }))}
            >
                <FontAwesomeIcon css={iconStyles} icon={faCaretDown} />
            </button>
        </div>
    );
};

const Card = ({
    id,
    content,
    questionId,
}: {
    id: string;
    content: string;
    questionId: string;
}) => {
    const foundIndex = useSelector<{ vote: VoteSliceState }, number | null>(
        (state) => {
            const votes = state.vote?.votes;
            const questionVotes = votes?.[questionId];
            return questionVotes ? questionVotes[id] : null;
        },
    );

    const indexMarker =
        foundIndex === null ? (
            <div
                css={css`
                    ${markerStyles}
                    background-color: ${colors.greyple};
                `}
            >
                No preference
            </div>
        ) : (
            <div
                css={css`
                    ${markerStyles}
                    background-color: ${colors.darkerBlurple};
                    padding-left: 10px;
                    padding-right: 10px;
                `}
            >
                {humanize(foundIndex)}
            </div>
        );

    return (
        <div
            css={css`
                ${baseCardStyles}
                ${foundIndex ? votingStyles : null}
        background-color: ${foundIndex === null
            ? colors.darkerGreyple
            : colors.blurple};
            `}
        >
            {indexMarker}
            <p>{content}</p>
            <div css={{ flexGrow: 1 }} />
            <Buttons questionId={questionId} optionId={id} />
        </div>
    );
};

const CardList = React.memo(function CardList({
    cards,
    questionId,
    handler,
    reverseMap
}: {
    cards: string[];
    questionId: string;
    handler: VoteProps["handler"];
    reverseMap: Record<string, string>;
}) {
    const votes = useSelector<
        { vote: VoteSliceState },
        Record<string, number | null>
    >((state) => {
        const votes = state.vote?.votes;
        const questionVotes = votes?.[questionId];
        return questionVotes;
    });

    useEffect(() => {
        if (!votes) {
            return;
        }

        const updated = Object.fromEntries(
            Object.entries(votes).map(([slug, vote]) => [reverseMap[slug], vote])
        );

        handler(updated);
    }, [votes]);

    if (votes) {
        cards = cards.sort((a, b) => {
            if (!votes[slugify(a)]) {
                return 1;
            }

            if (!votes[slugify(b)]) {
                return -1;
            }
            return votes[slugify(a)] - votes[slugify(b)];
        });
    }

    return (
        <FlipMove duration={500}>
            {cards.map((cardContent: string) => (
                <div key={slugify(cardContent)}>
                    <Card
                        content={cardContent}
                        questionId={questionId}
                        id={slugify(cardContent)}
                    />
                </div>
            ))}
        </FlipMove>
    );
});

export default function Vote(props: VoteProps): JSX.Element {
    const [state,] = useState({
        cards: props.options
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value),
    });

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            registerVote({
                questionId: props.questionId,
                questionSlugs: state.cards.map((value) => slugify(value)),
            }),
        );
    }, [props.questionId]);

    const reverseMap = Object.fromEntries(props.options.map(value => {
        return [slugify(value), value];
    }));

    const COPY = "Use the buttons to organise options into your preferred order. You can have multiple options with the same ranking. Additionally, you can leave some or all options as \"No preference\" if you do not wish to order them.";

    return (
        <div>
            <p>{COPY}</p>
            <CardList
                questionId={props.questionId}
                handler={props.handler}
                cards={state.cards}
                reverseMap={reverseMap}
            />
        </div>
    );
}
