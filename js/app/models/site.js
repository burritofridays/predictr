/**
  A data model representing the site (instance of HaveFunHub)

  @class Site
  @extends HaveFunHub.Model
  @namespace HaveFunHub
  @module HaveFunHub
**/

  HaveFunHub.Site = HaveFunHub.Model.extend({

    notificationLookup: (function() {
      var result;
      result = [];
      Object.keys(this.get('notification_types'), function(k, v) {
        result[v] = k;
      });
      return result;
    }).property('notification_types'),

    flagTypes: (function() {
      var postActionTypes;
      postActionTypes = this.get('post_action_types');
      if (!postActionTypes) {
        return [];
      }
      return postActionTypes.filterProperty('is_flag', true);
    }).property('post_action_types.@each'),

    postActionTypeById: function(id) {
      return this.get("postActionByIdLookup.action" + id);
    },

    updateCategory: function(newCategory) {
      var existingCategory = this.get('categories').findProperty('id', Em.get(newCategory, 'id'));
      if (existingCategory) existingCategory.mergeAttributes(newCategory);
    }
  });

  HaveFunHub.Site.reopenClass({
    create: function(obj) {
      var _this = this;
      return Object.tap(this._super(obj), function(result) {
        if (result.categories) {
          result.categories = result.categories.map(function(c) {
            return HaveFunHub.Category.create(c);
          });
        }
        if (result.post_action_types) {
          result.postActionByIdLookup = Em.Object.create();
          result.post_action_types = result.post_action_types.map(function(p) {
            var actionType;
            actionType = HaveFunHub.PostActionType.create(p);
            result.postActionByIdLookup.set("action" + p.id, actionType);
            return actionType;
          });
        }
        if (result.archetypes) {
          result.archetypes = result.archetypes.map(function(a) {
            return HaveFunHub.Archetype.create(a);
          });
        }
      });
    }
  });

