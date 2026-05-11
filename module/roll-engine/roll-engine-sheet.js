/**
* Extend the basic ActorSheet with some very simple modifications
* @extends {FormApplication}
*/
window.Handlebars.registerHelper('select', function (value, options) {
    var $el = $('<select />').html(options.fn(this));
    $el.find('[value="' + value + '"]').attr({ 'selected': 'selected' });
    return $el.html();
});
function getNum(val) {
    val = +val || 0
    return val;
}
export class RollEngineDialogSheet extends FormApplication {
    /** @override */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["legacy2e", "sheet"],
            template: "systems/legacy2e/module/roll-engine/roll-engine-sheet-template.hbs",
            title: "Time to roll!",
            closeOnSubmit: false,
            submitOnChange: true,
            submitOnClose: false,
            width: 800,
            height: 200,
            resizable: false
        });
    }
    getData() {
        // Basic data
        const data = super.getData().object;
        data.modifier = data.dataset.value
        data.type = ""
        data.addDice = "1"
        return data
    }
    _updateObject(event, formData) {
        let data = this.object
        data.modifier = formData.modifier
        data.type = formData.type
        data.addDice = formData.addDice

    }
    activateListeners(html) {
        super.activateListeners(html)
        let data = this.object
        html.on("change", ".typeSelect", (ev) => {
            if (data.type) {
                console.log(html.find(".diceSelector"))
                html.find(".diceSelector")[0].style.display = "block"
            }
            else {
                html.find(".diceSelector")[0].style.display = "none"
            }
        })
        html.on("click", ".rollBtn", async (ev) => {
            var dicecount = 2 + (data.type ? getNum(data.addDice) : 0)
            let roll = new Roll('(' + dicecount + `d6k${data.type < 0 ? "l" : "h"}2)+` + getNum(data.modifier), data.actor.getRollData());
            await roll.evaluate()
            roll.toMessage({
                speaker: ChatMessage.getSpeaker({ actor: data.actor }),
                flavor: `<div class='flexcolcenter'>${roll.total <= 6 ? "<label style='color:red'>Miss</label>" : roll.total >= 7 && roll.total <= 9 ? "<label style='color:yellow'>Partial Success</label>" : "<label style='color:green'>Success</label>"}</div>`,
                rollMode: game.settings.get('core', 'rollMode'),
            });
        })

    }
}