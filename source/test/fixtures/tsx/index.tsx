import React from 'react';

interface UnicornProps {
	unicorn: number;
	rainbow: string;
}

export const Unicorn = ({ rainbow }: UnicornProps) => (
	<h1>{rainbow}</h1>
);
