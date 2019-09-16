from .base import JsonObject, JsonObjectDataMapper

class CampaignObject(JsonObject):
    _pathPrefix = "campaign"
    _fieldTypes = {
        'id': int,
        'user_id': int,
        'toc': {}
        }


class CampaignMapper(JsonObjectDataMapper):
    obj = CampaignObject
    table = "campaign"
    fields = ['name', 'user_id']

    def getList(self, search=None):
        """Returns a list of campaigns matching the search parameter"""
        return self.getMultiple(
            "`name` LIKE :search",
            {"search": '%%%s%%' % search}
            )

    def getByDmUserId(self, user_id):
        """Returns all campaigns created by DM by user_id"""
        cur = self.db.execute("""
            SELECT *
            FROM `%s`
            WHERE `user_id` = ?
            """ % self.table,
            [user_id]
            )
        campaigns = cur.fetchall() or []
        return [
            self._read(dict(campaign))
            for campaign in campaigns
            if campaign
            ]
