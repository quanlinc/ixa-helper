import Optional from '../src/utils/tool'
enum REPORT_TYPE {
    DISCOVERY = '秘境探索',
    SPACE_ATTACK = '空き地攻撃',
}


function testOpional() {
    let testValue: string | null;
    testValue = '1'
    const r1 = Optional.of(testValue).map(c => Number(c)).getOrDefault(0);
    console.log(r1);
}

function testEnumKeyBySymble() {

}

testEnumKeyBySymble()