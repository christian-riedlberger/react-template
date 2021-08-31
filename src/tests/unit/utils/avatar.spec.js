import { getAvatarUrl } from 'utils/avatar';

describe('avatar.js', () => {
    describe('getAvatarUrl', () => {
        it('should get a url for an empty group', () => {
            expect(getAvatarUrl({})).toEqual(null);
            expect(getAvatarUrl(null)).toEqual(null);
            expect(getAvatarUrl(undefined)).toEqual(null);
        });

        it('should get a url for a un-initialized group', () => {
            expect(getAvatarUrl({ shortName: 'test' }, 'test')).toEqual(
                'ERROR-DOMAIN/alfresco/s/greenfence/api/authority/avatar/test_organization?v=test&alf_ticket='
            );
        });
    });
});
