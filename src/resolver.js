import actions from "./action.json" assert { type: "json" };
import nodeObjects from "./node.json" assert { type: "json" };
import resourceTemplates from "./resourceTemplate.json" assert { type: "json" };
import responsesList from "./response.json" assert { type: "json" };
import triggers from "./trigger.json" assert { type: "json" };

const resolvers = {
  Query: {
    node: (_, { nodeId }) => {
      console.log("node finding");
      let targetNode = nodeObjects.find((node) => node._id === nodeId) || null;
      return targetNode;
    },
  },

  NodeObject: {
    trigger: (node) => {
      console.log("node trigger");
      return triggers.find((trigger) => trigger._id === node.trigger) || null;
    },
    triggerId: (node) => {
      return node.trigger;
    },
    responses: (node) => {
      //   console.log("node responses finding");
      //   console.log(node.responses);
      //   console.log(
      //     responsesList.filter((response) =>
      //       node.responses.includes(response._id)
      //     )
      //   );
      return responsesList.filter((response) =>
        node.responses.includes(response._id)
      );
    },
    responseIds: (node) => {
      return node.responses;
    },
    actions: (node) => {
      // pre action/ action/ post acion
      let actionList = [];

      if (node.preActions) actionList.push(...node.preActions.flat());
      if (node.actions) actionList.push(...node.actions.flat());
      if (node.postActions) actionList.push(...node.postActions.flat());

      console.log(node.preActions, node.actions, node.postActions);
      console.log("action list", actionList);
      return actions.filter((action) => actionList.includes(action._id));
    },
    actionIds: (node) => {
      let actionList = [];

      if (node.preActions) actionList.push(...node.preActions.flat());
      if (node.actions) actionList.push(...node.actions.flat());
      if (node.postActions) actionList.push(...node.postActions.flat());
      return actionList;
    },
    parents: (node) => {
      //   console.log(
      //     nodeObjects.filter((parent) =>
      //       node.parents.includes(parent.compositeId)
      //     )
      //  );
      return nodeObjects.filter((parent) =>
        node.parents.includes(parent.compositeId)
      );
    },
    parentIds: (node) => {
      return node.parents;
    },
  },

  Action: {
    resourceTemplate: (action) => {
      return (
        resourceTemplates.find(
          (template) => template._id == action.resourceTemplateId
        ) || null
      );
    },
  },

  Trigger: {
    resourceTemplate: (trigger) => {
      return (
        resourceTemplates.find(
          (template) => template._id === trigger.resourceTemplateId
        ) || null
      );
    },
  },
  Response: {
    platforms: (response) => {
      return response.platforms ? response.platforms : null;
    },
  },
  ResponsePlatform: {
    localeGroups: (platform) => {
      return platform.localeGroups ? platform.localeGroup : null;
    },
  },
  ResponseLocaleGroup: {
    variations: (localeGroup) => {
      return localeGroup.variations ? localeGroup.variations : null;
    },
  },
  ResponseVariation: {
    responses: (variation) => {
      return variation.responses ? variation.responses : null;
    },
  },
};

export default resolvers;
