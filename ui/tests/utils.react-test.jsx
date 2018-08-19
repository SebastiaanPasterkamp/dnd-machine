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

    it('should resolve math', () => {
        const obj = {
            path: 5,
        };

        expect(
            utils.resolveMath(obj, 'test.path * 2', 'test')
        ).toBe(10);

        expect(
            utils.resolveMath(obj, 'test.gone', 'test')
        ).toBe(undefined);

        expect(
            utils.resolveMath(obj, 'test.gone', 'test')
        ).toBe(undefined);

        expect(
            utils.resolveMath(obj, 'min(3, 5)', 'test')
        ).toBe(3);
        expect(
            utils.resolveMath(obj, 'max(3, 5)', 'test')
        ).toBe(5);
        expect(
            utils.resolveMath(obj, 'ceil(5 / 2.0)', 'test')
        ).toBe(3);
        expect(
            utils.resolveMath(obj, 'floor(5 / 2.0)', 'test')
        ).toBe(2);
    });
});
