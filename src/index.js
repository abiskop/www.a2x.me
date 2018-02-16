import './styles.css';
import '../assets/img/favicon.png';

const createPalette = () => {
    let i = 0;
    const colors = [
        '#043D62',
        'antiquewhite',
        '#FBF6F6',
        '#16C8AF',
        '#7aa9c8',
        'burlywood',
        'cadetblue',
        '#CF7C6D'
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

    const emptyBlock = ({ color }) => {
        const div = document.createElement('div');
        div.setAttribute('style', `
            flex-grow: 1;
            transition: flex-grow .5s ease-out;
            background-color: ${color};
        `);
        return div;
    };

    const timestamps = [...new Set(Object.values(timing.toJSON()))]
        .filter(value => value > 0);
    if (timestamps.length < 3) { return; }

    const total = timestamps[timestamps.length - 1] - timestamps[0];
    const durations = timestamps
        .sort((a, b) => a - b)
        .reduce((series, value) => {
            const previous = series[series.length - 1];
            const duration = previous ? value - previous.time : 0;
            const element = {
                time: value,
                duration,
                percentage: Math.floor(100 * duration / total)
            };
            return series.concat(element);
        }, []);

    const container = document.querySelector('[data-perf-container]');
    const placeholder = document.querySelector('[data-perf-placeholder]');
    durations.forEach(({ percentage }) => {
        const div = emptyBlock({ color: palette.next() });
        container.appendChild(div);
        setTimeout(() => {
            requestAnimationFrame(() => {
                div.style['flex-grow'] = percentage;
            });
        }, 0);
    });
    requestAnimationFrame(() => {
        placeholder.style['flex-grow'] = 1;
    });
}

window.addEventListener('load', () => {
    plotPerformance();
});