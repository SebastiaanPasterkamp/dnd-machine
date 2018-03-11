import utils from '../src/jsx/utils.jsx';

describe('utils:', () => {
    it('should create random colors', () => {
        const a = utils.randomColor();
        const b = utils.randomColor();

        expect(a.length).toBe(7);
        expect(a).toMatch(/^#[0-9A-F]{6}$/);
        expect(a).not.toBe(b);
    });

    it('should make correct styles', () => {
        expect(utils.makeStyle()).toBe(null);

        expect(utils.makeStyle({
            foo: true
        })).toBe('foo');

        expect(utils.makeStyle({
            foo: false
        })).toBe(null);

        expect(utils.makeStyle({}, [
            'default'
        ])).toBe('default');

        expect(utils.makeStyle({
            yes: true,
            no: false,
        }, [
            'default', null
        ])).toBe('default yes');
    });

    it('should find the closest match', () => {
        const styles = {
            bad: 10,
            warning: 25,
            good: 50,
        };

        expect(utils.closest(styles, 0)).toBe('bad');

        expect(utils.closest(styles, 20)).toBe('warning');

        expect(utils.closest(styles, 40)).toBe('good');

        expect(utils.closest(styles, 100)).toBe('good');

        expect(utils.closest({}, 100, 'muted')).toBe('muted');
    });
});
