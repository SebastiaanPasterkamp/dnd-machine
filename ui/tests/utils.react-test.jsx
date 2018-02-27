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

        expect(utils.closestStyle(styles, 0)).toBe('bad');

        expect(utils.closestStyle(styles, 20)).toBe('warning');

        expect(utils.closestStyle(styles, 40)).toBe('good');

        expect(utils.closestStyle(styles, 100)).toBe('good');

        expect(utils.closestStyle({}, 100, 'muted')).toBe('muted');
    });
});
