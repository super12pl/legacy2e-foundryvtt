/**
* @extends {ActorSheet}
*/
import {
    rollEngine
} from "../roll-engine/roll-engine.js";
export class Legacy2eActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["legacy2e", "sheet", "actor"],
            width: 800,
            height: 1000,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body" }]
        });
    }
    /** @override */
    get template() {
        const path = 'systems/legacy2e/module/actor';
        console.log(`${path}/${this.actor.type}-sheet-template.hbs`)
        return `${path}/${this.actor.type}-sheet-template.hbs`;
    }
    /** @override */
    getData() {
        const context = super.getData()
        const actorData = context.data
        context.system = actorData.system
        context.flags = actorData.flags
        context.rollData = context.actor.getRollData();
        return context
    }
    async _onRoll(event) {
        event.preventDefault()
        const element = event.currentTarget
        const dataset = element.dataset
        rollEngine({ actor: this.actor, dataset: dataset, sheet: this })
    }
    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', '.rollable', this._onRoll.bind(this));
    }
}