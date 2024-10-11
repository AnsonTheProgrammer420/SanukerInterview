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
      console.log("node responses finding");
      console.log(node.responses);
      console.log(
        responsesList.filter((response) =>
          node.responses.includes(response._id)
        )
      );
      return responsesList.filter((response) =>
        node.responses.includes(response._id)
      );
    },
    responseIds: (node) => {
      return node.responses;
    },
    actions: (node) => {
      // pre action/ action/ post acion
      return actions.filter((action) => node.actionIds.includes(action._id));
    },
    // parents: (node) => {
    //   return node.parentIds
    //     .map((parentId) =>
    //       nodeObjects.find((parent) => parent._id === parentId)
    //     )
    //     .filter((parent) => parent !== undefined);
    // },
  },
  Action: {
    resourceTemplate: (action) => {
      return (
        resourceTemplates.find(
          (template) => template._id === action.resourceTemplateId
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
      return response.platforms; // Assume platforms are already populated in the response
    },
  },
  ResponsePlatform: {
    localeGroups: (platform) => {
      return platform.localeGroups; // Assume localeGroups are populated
    },
  },
  ResponseLocaleGroup: {
    variations: (localeGroup) => {
      return localeGroup.variations; // Assume variations are populated
    },
  },
  ResponseVariation: {
    responses: (variation) => {
      return variation.responses; // Assume responses are populated
    },
  },
};

export default resolvers;
