'use strict';

import './styles.css';
import '../assets/img/favicon.png';

const createPalette = () => {
    let i = 0;
    const colors = [
        '#768B99',
        '#FF7A63',
        '#CC6766'
    ];
    return {
        next: () => {
            const color = colors[i];
            i = (i + 1) % colors.length;
            return color;
        }
    };
}

const palette = createPalette();

function plotPerformance() {
    const { timing } = window.performance || {};
    if (!timing || !timing.toJSON) { return; }

    const blockElement = ({ color, percentage }) => {
        const div = document.createElement('div');
        div.setAttribute('style', `
            flex-grow: ${percentage};
            background-color: ${color};
        `);
        return div;
    };

    const timestamps = [...new Set(Object.values(timing.toJSON()))]
        .filter(value => value > 0);
    if (timestamps.length < 3) { return; }

    const start = timestamps[0];
    const total = timestamps[timestamps.length - 1] - start;
    const durations = timestamps
        .slice(1)
        .sort((a, b) => a - b)
        .reduce((series, value) => {
            const previous = series[series.length - 1];
            const duration = previous ? value - previous.time : value - start;
            const percentage = Math.floor(100 * duration / total);
            const element = {
                time: value,
                duration,
                percentage,
                node: blockElement({ color: palette.next(), percentage })
            };
            return series.concat(element);
        }, []);

    const container = document.querySelector('[data-perf-container]');
    durations.forEach(({ node }) => {
        container.appendChild(node);
    });
    requestAnimationFrame(() => {
        container.style['width'] = '100%';
    });
}

window.addEventListener('load', () => {
    plotPerformance();
});