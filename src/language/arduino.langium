grammar Arduino

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w]*/;
terminal INT: /\d+/;

entry Model: (elements+=Element)*;

Element: App;

App: 'app' name=ID '{'
    (bricks+=Brick)*
    (states+=State)*
    'initial' initialState=[State]
    '}';

Brick: 'brick' name=ID ':' type=BrickType ('initial' initialState=('HIGH' | 'LOW'))?;

BrickType: SENSOR='SENSOR' | ACTUATOR='ACTUATOR';

State: 'state' name=ID '{'
    (actions+=Action)*
    (transitions+=Transition)*
    '}';

Action: 'set' brick=[Brick] 'to' (value='HIGH' | value='LOW' | value=INT);

Transition: TemporalTransition | PinAllocatedTransition;

TemporalTransition: 'after' duration=INT 'transition' 'to' state=[State];

PinAllocatedTransition: 'when' conditions+=PinCondition ('and' conditions+=PinCondition)* 'transition' 'to' state=[State];

PinCondition: brick=[Brick] 'is' conditionValue=PinConditionValue;

PinConditionValue: value='HIGH' | value='LOW' | value=INT;
    