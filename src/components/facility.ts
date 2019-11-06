import { getHtml, post } from '@/utils/io'
import { isNil } from 'ramda'
/**
 * Modeling facility, mainly focus on unit training ones as others don't have much to do with them but upgrading
 */

const YARI = {
    足軽: '321',
    長槍足軽: '322',
    武士: '323',
}

const YUMI = {
    弓足軽: '325',
    長弓兵: '326',
    弓騎馬: '327',
}

const KIBA = {
    騎馬兵: '329',
    精鋭騎馬: '330',
    赤備え: '331',
}

const KAJI: {[key: string]: string} = {
    破城鎚: '333',
    攻城櫓: '334',
    穴太衆: '335',
    大筒兵: '',
    鉄砲足軽: '336',
    騎馬鉄砲: '',
    焙烙火矢: '',
} as const

// Define unit and their corresponding code
const ALL_UNITS: {[key: string]: string} = {
    ...YARI, ...YUMI, ...KIBA, ...KAJI,
}

export enum UNIT_CATEGORY {
    YARI, YUMI, KIBA, KAJI,
}

export enum TRAINING_MODE {
    NORMAL, HIGH_SPEED, UPGRADE,
}

interface UnitTraining {
    x: string,
    y: string,
    unit_id: string,
    count: string

    // high speed training
    high_speed: string,

    // upgrade training
    upgrade: string,
    from?: string,
    to: string
}

class Facility {
    public dom: HTMLAreaElement | null = null
    public x: string | null = null
    public y: string | null = null
    public title: string | null = null
    private postEndpoint: URL

    // constructor should explicitly have fields defined, cannot be nested in a subroutine, which applies to postEndpoint here
    constructor(el: HTMLElement) {
        this.dom = el as HTMLAreaElement
        this.title = this.dom.title
        this.postEndpoint = new URL(this.dom.href, document.location.href.slice(0, location.href.lastIndexOf('/')))
        this.x = this.postEndpoint.searchParams.get('x')
        this.y = this.postEndpoint.searchParams.get('y')
    }

    // simple say if coordinate information is available, we should be able to get the facility
    public isAvailable() {
        if (isNil(this.x) || isNil(this.y) ) {
            return false
        }
        return true
    }

    public trainUnit(quantity: string, trainingMode: TRAINING_MODE, toUnitId: string, fromUnitId?: string ) {
        switch (trainingMode) {
            case TRAINING_MODE.NORMAL:
                this.normalTraining(quantity, toUnitId)
                break
            case TRAINING_MODE.HIGH_SPEED:
                this.speedTraining(quantity, toUnitId)
                break
            case TRAINING_MODE.UPGRADE:
                this.upgradeTraining(quantity, toUnitId, fromUnitId)
                break
            default:
                break
        }
    }

    public async getUnitInfo(): Promise<Document> {
        return  await getHtml(this.postEndpoint.href)
    }

    /* Need to append the hash here to distinguish training mode
     * #tab1 -> normal
     * #tab2 -> high speed
     * #tab3 -> upgrade
     */
    private normalTraining(quantity: string, toUnitId: string) {
        if (this.postEndpoint) {
            const requestPayload = this.constructRequestPayload(quantity, TRAINING_MODE.NORMAL, toUnitId)
            const url = this.postEndpoint.href.concat('#tab1')
            return post(url, requestPayload)
        }
        return Promise.reject('no endpoint specified')
    }

    private speedTraining(quantity: string, toUnitId: string) {
        if (this.postEndpoint) {
            const requestPayload = this.constructRequestPayload(quantity, TRAINING_MODE.HIGH_SPEED, toUnitId)
            const url = this.postEndpoint.href.concat('#tab2')
            return post(url, requestPayload)
        }
        return Promise.reject('no endpoint specified')
    }

    private upgradeTraining(quantity: string, toUnitId: string, fromUnitId: string | undefined) {
        if (this.postEndpoint) {
            const requestPayload = this.constructRequestPayload(quantity, TRAINING_MODE.UPGRADE, toUnitId, fromUnitId)
            const url = this.postEndpoint.href.concat('#tab3')
            return post(url, requestPayload)
        }
        return Promise.reject('no endpoint specified')
    }

    private constructRequestPayload(quantity: string, trainingMode: TRAINING_MODE,
                                    toUnitId: string, fromUnitId?: string) {
        const payload = new FormData()
        if (this.x) {
            payload.append('x', this.x)
        }

        if (this.y) {
            payload.append('y', this.y)
        }

        payload.append('unit_id', toUnitId)
        payload.append('count', quantity)

        switch (trainingMode) {
            case TRAINING_MODE.HIGH_SPEED:
                payload.append('high_speed', '1')
                break
            case TRAINING_MODE.UPGRADE:
                payload.append('upgrade', '1')
                if (fromUnitId) {
                    payload.append('from', fromUnitId)
                }
                payload.append('to', toUnitId)
                break
            default:
        }
        return payload
    }
}

export {
    Facility,
    YARI,
    YUMI,
    KIBA,
    KAJI,
    ALL_UNITS,
}
