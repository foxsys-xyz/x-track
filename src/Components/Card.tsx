import styled from 'styled-components';

interface CardProps {
    className?: string;
}

const Card = styled.div.attrs<CardProps>(({ className }) => (
    { className: 'p-8 bg-gray-900 bg-opacity-40 rounded-3xl shadow-2xl ' + className }
))``;

export default Card;
