export type WasteCategory = 'BURNABLE' | 'NON_BURNABLE' | 'RECYCLABLE' | 'OVERSIZED' | 'HAZARDOUS';

export interface CategoryInfo {
  id: WasteCategory;
  name: string;
  jpName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconName: string;
  description: string;
}

export const CATEGORIES: Record<WasteCategory, CategoryInfo> = {
  BURNABLE: {
    id: 'BURNABLE',
    name: 'Burnable',
    jpName: '可燃ごみ',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-600',
    iconName: 'Flame',
    description: '生ごみ、紙くず、ゴム・皮革製品、少量の植物など、燃やせるゴミです。'
  },
  NON_BURNABLE: {
    id: 'NON_BURNABLE',
    name: 'Non-burnable',
    jpName: '不燃ごみ',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
    iconName: 'Sparkles',
    description: '陶器、ガラス類、小型の金属製品、アルミホイルなど、燃やせないゴミです。'
  },
  RECYCLABLE: {
    id: 'RECYCLABLE',
    name: 'Recyclable',
    jpName: '資源ごみ',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-600',
    iconName: 'Recycle',
    description: 'ペットボトル、かん、びん、新聞・段ボール、きれいなプラスチック容器などです。'
  },
  OVERSIZED: {
    id: 'OVERSIZED',
    name: 'Oversized',
    jpName: '粗大ごみ',
    color: 'from-amber-700 to-yellow-800',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    iconName: 'Tv',
    description: '一般的に一辺が30cm（または50cm）を超える大型の家具や寝具、自転車などです。'
  },
  HAZARDOUS: {
    id: 'HAZARDOUS',
    name: 'Hazardous',
    jpName: '有害・危険ごみ',
    color: 'from-purple-500 to-pink-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-600',
    iconName: 'TriangleAlert',
    description: '乾電池、スプレー缶、蛍光管、モバイルバッテリーなど、爆発や有害物質漏洩の危険があるゴミです。'
  }
};

export interface WasteItem {
  id: string;
  name: string;
  category: WasteCategory;
  hint: string;
  explanation: string;
  lucideIcon: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'INSANE';
}

export const WASTE_ITEMS: WasteItem[] = [
  {
    id: 'banana-peel',
    name: 'バナナの皮',
    category: 'BURNABLE',
    hint: '水分をよく切って捨てるのがマナーだよ。',
    explanation: '生ごみは可燃ごみの代表例です。捨てる際は、焼却炉の燃焼効率を下げないために、よく水切りをして水分を減らすのがポイントです。',
    lucideIcon: 'Apple',
    difficulty: 'EASY'
  },
  {
    id: 'ceramic-plate',
    name: '割れたお皿（陶磁器）',
    category: 'NON_BURNABLE',
    hint: '割れていても燃えない素材。捨てる時は「キケン」と書くことも。',
    explanation: '陶器や磁器は熱に強く、焼却炉で燃やすことができません。回収時の安全のため、新聞紙などに包んで「キケン」等と表記して不燃ごみに出す自治体が多いです。',
    lucideIcon: 'GlassWater',
    difficulty: 'EASY'
  },
  {
    id: 'pet-bottle',
    name: 'ペットボトル（きれいなもの）',
    category: 'RECYCLABLE',
    hint: 'キャップとラベルは外して、中を軽くゆすいでね。',
    explanation: '飲料用や調味料用のきれいなペットボトルは貴重なプラスチック資源です。キャップとラベルはプラ容器包装（または可燃）に分け、中をすすいで潰して出します。',
    lucideIcon: 'Container',
    difficulty: 'EASY'
  },
  {
    id: 'bicycle',
    name: '自転車',
    category: 'OVERSIZED',
    hint: 'ゴミ袋に入り切らない大きな金属製品。回収手続きが必要だよ。',
    explanation: '一般的なゴミ袋に入らない大きさ（一辺が30cm〜50cm以上）のものは粗大ごみになります。事前に自治体の受付センターへの申し込みと、手数料シールの購入が必要です。',
    lucideIcon: 'Bike',
    difficulty: 'EASY'
  },
  {
    id: 'dry-battery',
    name: '乾電池',
    category: 'HAZARDOUS',
    hint: '他の電池とこすれ合うと発火する恐れがあるので、電極にテープを貼ろう。',
    explanation: 'アルカリ・マンガン乾電池などは「有害ごみ」や「特定ごみ」として別途回収されます。電極どうしが接触するとショートして発火する危険があるため、端子部にセロハンテープなどを貼って絶縁して出します。',
    lucideIcon: 'BatteryCharging',
    difficulty: 'MEDIUM'
  },
  {
    id: 'leather-shoes',
    name: '本革の靴（金具付き）',
    category: 'BURNABLE',
    hint: '金具が少しついていても、本体が革やゴムなら…？',
    explanation: '革靴やスニーカーは、小さな金属（靴紐のハトメやバックルなど）が付いていても、大部分が可燃素材（皮革、布、ゴム）であるため「可燃ごみ」として扱われる自治体が大半です。',
    lucideIcon: 'Footprints',
    difficulty: 'MEDIUM'
  },
  {
    id: 'spray-can',
    name: 'スプレー缶（ヘアスプレーなど）',
    category: 'HAZARDOUS',
    hint: '中にガスが残っていると、ゴミ収集車の中で火災を起こすよ。',
    explanation: 'スプレー缶やカセットボンベは、中身のガスが残ったままだとゴミ収集車や処理施設で爆発・火災事故を引き起こします。必ず使い切ってから、有害ごみ・危険ごみとして出しましょう。穴あけの有無は自治体によって異なります。',
    lucideIcon: 'Wind',
    difficulty: 'EASY'
  },
  {
    id: 'cardboard',
    name: 'ダンボール',
    category: 'RECYCLABLE',
    hint: '折りたたんで、ビニール紐などで縛ってまとめるのが一般的。',
    explanation: 'ダンボールはリサイクル効率の非常に高い「紙資源」です。粘着テープや配送伝票は剥がし、平らに折りたたんでから、紐で十文字に縛って資源ごみの日に出します。',
    lucideIcon: 'FileBox',
    difficulty: 'EASY'
  },
  {
    id: 'aluminum-foil',
    name: 'アルミホイル（使用後）',
    category: 'NON_BURNABLE',
    hint: '薄い金属のシート。燃やすと溶けて炉を痛めるよ。',
    explanation: 'アルミホイルは「金属」ですので燃えません。汚れを軽く落としても「不燃ごみ」になります。ただし、一部の非常に高温で処理する自治体では可燃とされる場合もありますが、基本は不燃ごみです。',
    lucideIcon: 'Grid',
    difficulty: 'MEDIUM'
  },
  {
    id: 'wooden-chair',
    name: '木製の椅子',
    category: 'OVERSIZED',
    hint: '木でできていて燃えそうだけど、大きさが問題。',
    explanation: '木製であっても、指定のゴミ袋（一般的に45L袋）に入らない家具類は「粗大ごみ」に分類されます。細かく解体して袋に入れば可燃ごみとして出せる自治体もあります。',
    lucideIcon: 'Armchair',
    difficulty: 'MEDIUM'
  },
  {
    id: 'mobile-battery',
    name: 'モバイルバッテリー（リチウムイオン）',
    category: 'HAZARDOUS',
    hint: 'スマートフォンの充電に使うよ。近年、収集車での発火事故が急増中！',
    explanation: 'モバイルバッテリー等に使われるリチウムイオン電池は、強い圧力がかかると激しく発火します。通常のゴミに混ぜるとゴミ収集車での大火災の原因になるため極めて危険です。家電量販店などの回収ボックスか、自治体の特定有害ごみへ。',
    lucideIcon: 'SmartphoneCharging',
    difficulty: 'HARD'
  },
  {
    id: 'dirty-plastic-tray',
    name: '油でベトベトのカップ麺容器',
    category: 'BURNABLE',
    hint: 'プラスチック製だけど、水で洗っても油汚れが落ちないときは？',
    explanation: 'プラスチックは資源になりますが、それは「きれいなもの」に限られます。油汚れや食べ残しが固着して洗っても落ちないプラスチック容器は、リサイクルに適さないため「可燃ごみ」として燃やすのが一般的です。',
    lucideIcon: 'Soup',
    difficulty: 'MEDIUM'
  },
  {
    id: 'incandescent-bulb',
    name: '白熱電球',
    category: 'NON_BURNABLE',
    hint: 'ガラスと金属のフィラメントでできているよ。割れないように保護して捨てよう。',
    explanation: '白熱電球はガラスと金属の複合製品であり、リサイクルが難しいため「不燃ごみ」になります。新しい電球が入っていた箱に入れるなどして、割れない工夫をして出すのが親切です（蛍光灯やLEDは有害・資源など別区分が多いです）。',
    lucideIcon: 'Lightbulb',
    difficulty: 'MEDIUM'
  },
  {
    id: 'newspaper',
    name: '新聞紙・チラシ',
    category: 'RECYCLABLE',
    hint: '古紙回収に出すと、また新しい新聞紙やコピー用紙に生まれ変わるよ。',
    explanation: '新聞紙や折り込みチラシは重要な「古紙資源」です。水に濡れないように晴れの日を狙うか、紐でしっかり縛って資源ごみとして排出します。',
    lucideIcon: 'Newspaper',
    difficulty: 'EASY'
  },
  {
    id: 'glass-cup',
    name: 'ガラス製のコップ（割れていない）',
    category: 'NON_BURNABLE',
    hint: '透明だけど「びん（飲料用）」とは素材が違い、溶ける温度が異なるよ。',
    explanation: '飲料用のガラスびんは資源ですが、耐熱ガラスやガラスコップは成分や溶融温度が異なるため「不燃ごみ」になります。これらが資源びんに混ざると製品不良の原因になってしまいます。',
    lucideIcon: 'CupSoda',
    difficulty: 'HARD'
  },
  {
    id: 'umbrella',
    name: '雨傘',
    category: 'NON_BURNABLE',
    hint: '骨組みが金属で、布やビニールが張ってあるよ。長さがあるけど不燃ごみになることが多い。',
    explanation: '傘は長さがありますが、多くの自治体で「不燃ごみ」の例外として袋からはみ出しても回収されます。金属の骨組みとビニールを分解して捨てるよう求める自治体もあります。',
    lucideIcon: 'Umbrella',
    difficulty: 'MEDIUM'
  },
  {
    id: 'sofa',
    name: 'ソファ',
    category: 'OVERSIZED',
    hint: 'スプリング金属や綿、革が混ざった巨大な家具。',
    explanation: '人が座るための大型家具は代表的な「粗大ごみ」です。スプリング（コイルスプリング）が入っているものは適正処理困難物として、別途追加料金がかかる自治体もあります。',
    lucideIcon: 'Sliders',
    difficulty: 'EASY'
  },
  {
    id: 'fluorescent-tube',
    name: '蛍光管（直管型・環型）',
    category: 'HAZARDOUS',
    hint: '微量の水銀が含まれているため、割らずに回収箱や専用ゴミの日に出そう。',
    explanation: '蛍光灯には有害な「水銀」が微量に使用されています。破損して大気中に放出されるのを防ぐため、割らないように購入時のケースなどに入れて「有害・危険ごみ」として別途回収を行います。LED電球は水銀を含まないため不燃ごみが多いです。',
    lucideIcon: 'Pipette',
    difficulty: 'HARD'
  },
  {
    id: 'notebook',
    name: '大学ノート（金属リングなし）',
    category: 'RECYCLABLE',
    hint: '金具やプラスチックの装飾がない、純粋な紙のノート。',
    explanation: '金具やプラスチックがついていないノートや雑記帳は、「雑がみ」という紙資源（リサイクル）に分類されます。表紙のビニールコーティングなどは除く必要があります。',
    lucideIcon: 'BookOpen',
    difficulty: 'MEDIUM'
  },
  {
    id: 'led-light',
    name: 'LED電球',
    category: 'NON_BURNABLE',
    hint: '水銀は使われていないけど、電子基板やプラスチック・金属が入っている。',
    explanation: 'LED電球は蛍光管とは異なり、有害な水銀を使用していません。そのため、一般的な電子部品含有の金属製品・ガラス製品として「不燃ごみ」に分類される自治体が多いです。',
    lucideIcon: 'Lightbulb',
    difficulty: 'HARD'
  },
  {
    id: 'empty-can-beverage',
    name: 'アルミ缶（ビール・炭酸飲料など）',
    category: 'RECYCLABLE',
    hint: '中を洗って潰して出そう。タバコの吸い殻などを中に入れないでね！',
    explanation: 'アルミ缶やスチール缶はリサイクルの優等生です。中を軽く洗って乾かしてから、資源ごみに出します。中に異物（タバコの吸い殻など）を絶対に入れないでください。',
    lucideIcon: 'Database',
    difficulty: 'EASY'
  },
  {
    id: 'mirror',
    name: '手鏡（鏡・プラスチック枠）',
    category: 'NON_BURNABLE',
    hint: '鏡はガラスの裏に金属が蒸着されているよ。',
    explanation: '鏡は特殊な金属コーティングが施されたガラスであるため、資源にはならず「不燃ごみ」になります。割れている場合は紙に包んで「キケン」と表示します。',
    lucideIcon: 'Smile',
    difficulty: 'MEDIUM'
  },
  {
    id: 'pizza-box-dirty',
    name: 'ピザの空き箱（油汚れあり）',
    category: 'BURNABLE',
    hint: 'ダンボール素材だけど、チーズや油がべっとり付着している。',
    explanation: 'ダンボールであっても、食品の油や臭いが染みついたものは製紙原料として再生できません。そのため、資源ごみではなく「可燃ごみ」として処分する必要があります。紙コップやケーキの箱なども同様です。',
    lucideIcon: 'Pizza',
    difficulty: 'HARD'
  },
  {
    id: 'hair-dryer',
    name: 'ドライヤー',
    category: 'NON_BURNABLE',
    hint: '小型の家電製品。指定袋に入るサイズなら粗大ごみではなく…？',
    explanation: '袋に入る大きさの小型家電（ドライヤー、トースター、アイロンなど）は「不燃ごみ」になります。また、自治体によっては公共施設に設置されている「小型家電回収ボックス」での回収（資源化）を行っています。',
    lucideIcon: 'Zap',
    difficulty: 'MEDIUM'
  },
  {
    id: 'blanket',
    name: '毛布（または布団）',
    category: 'OVERSIZED',
    hint: '布でできているけれど、一袋に収まらない大きな寝具。',
    explanation: '毛布や掛け布団、敷布団は、大部分が布製ですがサイズが非常に大きいため、基本的には「粗大ごみ」に分類されます。一部自治体では「可燃ごみ」として出せたり、細かく切り刻めば可燃ごみ袋で出せる場合もあります。',
    lucideIcon: 'Bed',
    difficulty: 'MEDIUM'
  },
  {
    id: 'disposable-body-warmer',
    name: '使い捨てカイロ',
    category: 'NON_BURNABLE',
    hint: '温かくなるのは中に入っている「あの金属粉」が酸化するからだよ。',
    explanation: '使い捨てカイロの主成分は「鉄粉」です。熱を発生させたあとも中身は金属（鉄）ですので、一般的には「不燃ごみ」として処理されます。一部「可燃ごみ」とする例外的な自治体もありますが、基本は不燃です。',
    lucideIcon: 'Flame',
    difficulty: 'INSANE'
  },
  {
    id: 'ice-pack-gel',
    name: '保冷剤（ジェル状のもの）',
    category: 'BURNABLE',
    hint: '99%は水でできていて、固めるために高吸水性ポリマーが使われているよ。',
    explanation: '保冷剤は水分を多く含みますが、中身の高吸水性ポリマーは燃やしても有害ガスが発生しないため、多くの自治体で「可燃ごみ」として処分できます。中身をシンクに流すと排水管が詰まるので絶対にやめましょう。',
    lucideIcon: 'Soup',
    difficulty: 'INSANE'
  },
  {
    id: 'potato-chip-bag',
    name: 'ポテトチップスの袋（内側が銀色）',
    category: 'BURNABLE',
    hint: 'アルミ製に見えるけれど、薄に金属をプラスチックに蒸着させた複合素材。',
    explanation: 'ポテトチップスの袋などの内側が銀色の包装は、プラスチックフィルムに極めて薄いアルミを蒸着したものです。大部分がプラスチックであり、かつ油で汚れているため、多くの自治体で「可燃ごみ」に分類されます。きれいな場合はプラスチック資源にする自治体もあります。',
    lucideIcon: 'Grid',
    difficulty: 'INSANE'
  },
  {
    id: 'cd-dvd',
    name: 'CD・DVDディスク',
    category: 'BURNABLE',
    hint: 'プラスチック（ポリカーボネート）でできているけれど、資源プラになる？',
    explanation: 'CDやDVD、BDなどの光ディスクはプラスチック製ですが、リサイクル用「容器包装プラスチック」の対象外（製品そのものがプラスチックのもの）となるため、多くの自治体で「可燃ごみ」として処理されます。',
    lucideIcon: 'Smartphone',
    difficulty: 'HARD'
  },
  {
    id: 'video-tape',
    name: 'ビデオテープ / カセットテープ',
    category: 'BURNABLE',
    hint: '外側は硬いプラスチック、内側は細長くて磁気のあるテープが入っている。',
    explanation: 'ビデオテープやカセットテープは、内部の長い磁気テープがごみ処理機械に巻き付くトラブルの原因になりますが、素材としてはプラスチック・プラスチックフィルムであるため、多くの自治体で「可燃ごみ」になります。指定袋に「ビデオテープのみ」と小分けにさせる自治体もあります。',
    lucideIcon: 'Tv',
    difficulty: 'HARD'
  },
  {
    id: 'credit-card',
    name: 'クレジットカード',
    category: 'BURNABLE',
    hint: 'ICチップや磁気ストライプ、裏面に署名欄など様々な素材があるよ。',
    explanation: 'クレジットカードやポイントカードはプラスチック（可燃ごみ）です。個人情報漏洩や不正利用を防ぐため、ハサミやシュレッダーでICチップや磁気ストライプごと細かく刻んでから可燃ごみに出すのが鉄則です。',
    lucideIcon: 'Smartphone',
    difficulty: 'HARD'
  },
  {
    id: 'gardening-soil',
    name: '観葉植物の古い土・砂',
    category: 'HAZARDOUS',
    hint: '自然界の土や砂は、じつは多くの自治体で「ゴミ」として回収してくれないよ。',
    explanation: '植木鉢の古い土や石、砂は「自然物」であり廃棄物処理法上のゴミに該当しないため、大半 of 自治体で回収を行っていません。購入した園芸店に引き取ってもらうか、専門の処理業者に依頼、あるいは自宅の庭に撒くなどの処理が必要です。ゲーム内では特別処分が必要な「有害・特定危険」にマッピングされます。',
    lucideIcon: 'GlassWater',
    difficulty: 'INSANE'
  },
  {
    id: 'razor-blades',
    name: 'カッターの刃 / カミソリ',
    category: 'NON_BURNABLE',
    hint: '鋭利な刃物。捨てる時は回収員さんが怪我をしないように工夫しよう。',
    explanation: '金属の刃がついたカミソリやカッターの刃は「不燃ごみ」です。回収作業員のケガを防ぐため、刃の部分を厚紙や新聞紙でしっかりと包み、外袋に「キケン」「カッター刃」などとわかりやすく表示して出す必要があります。',
    lucideIcon: 'Sparkles',
    difficulty: 'MEDIUM'
  },
  {
    id: 'lighter-with-gas',
    name: 'ライター（ガス残り）',
    category: 'HAZARDOUS',
    hint: 'そのまま捨てるとゴミ収集車や処理場で爆発炎上し、大きな火災に繋がるよ。',
    explanation: 'ガスが残った使い捨てライターは超危険物です。必ず中身を使い切るか、風通しの良い屋外でガス抜きを行ってから、「有害・危険ごみ（または特定ごみ）」として出します。絶対にそのまま他のゴミに混ぜてはいけません。',
    lucideIcon: 'Flame',
    difficulty: 'HARD'
  },
  {
    id: 'aluminum-insulated-bag',
    name: 'アルミ保冷温バッグ',
    category: 'BURNABLE',
    hint: '内側がアルミで、外が不織布やスポンジになっている持ち手付きの袋。',
    explanation: 'テイクアウト等に使われる保冷バッグはアルミ製に見えますが、ポリエステルや不織布に極めて薄いアルミをラミネートしたものです。金属としてはほぼカウントされず、大部分が燃える素材のため「可燃ごみ」となります。',
    lucideIcon: 'Package',
    difficulty: 'INSANE'
  },
  {
    id: 'glass-baby-bottle',
    name: 'ガラスの哺乳瓶',
    category: 'NON_BURNABLE',
    hint: '熱湯消毒に耐えられるように、特別な熱に強いガラスで作られているよ。',
    explanation: '哺乳瓶やグラタン皿などの「耐熱ガラス」は、通常のガラス瓶（飲料のガラスびんなど）とは異なり、溶融温度が非常に高いため、資源回収（びん）に混ぜるとリサイクル不良（塊が溶け残る）の原因になります。そのため「不燃ごみ」になります。',
    lucideIcon: 'GlassWater',
    difficulty: 'INSANE'
  },
  {
    id: 'socks-worn',
    name: '古い靴下（破れたもの）',
    category: 'BURNABLE',
    hint: '布でできていて、指定袋に余裕で収まるサイズ。',
    explanation: '破れたり片方無くしたボロボロの靴下は、純粋に「可燃ごみ」として処分します。なお、状態が良くて洗濯済みの衣服であれば、多くの自治体で「古着・繊維資源」としてリサイクル回収を行っています。',
    lucideIcon: 'Footprints',
    difficulty: 'EASY'
  },
  {
    id: 'plastic-toy',
    name: 'プラスチックのおもちゃ',
    category: 'BURNABLE',
    hint: '金属のネジや電子パーツ、電池は入っていないプラスチック製だよ。',
    explanation: '金属パーツや電気で動く部分のない、純粋なプラスチック製のおもちゃ（30cm未満）は「可燃ごみ」として処分するのが大半です。※電池やモーター、金属が大きく含まれるものは不燃ごみになります。',
    lucideIcon: 'Smile',
    difficulty: 'MEDIUM'
  },
  {
    id: 'tree-branches',
    name: '剪定した庭木の枝',
    category: 'BURNABLE',
    hint: '植物なので燃えるけれど、ゴミ袋に入る大きさにカットして、束ねて出す必要があるよ。',
    explanation: '庭木の枝や葉は自然物であり「可燃ごみ」です。ただし、そのままでは収集車に入らないため、長さ50cm未満・太さ数cm以下に切り揃え、紐で1束に縛る、あるいは指定ゴミ袋に入れて出すなどのルールがあります。あまりに大量・太い場合は粗大ごみになります。',
    lucideIcon: 'Wind',
    difficulty: 'HARD'
  },
  {
    id: 'dirty-canned-food',
    name: 'サバ缶（洗っていない空き缶）',
    category: 'NON_BURNABLE',
    hint: '缶だから資源ごみ？でも、魚の油汚れやニオイがひどく洗っていない。',
    explanation: 'スチール缶やアルミ缶は素晴らしい資源ですが、魚の油や身などの汚れがベトベトに残っているとリサイクルできません。水ですすいでも汚れが落ちない、あるいは洗わずに捨てる場合は、資源にならず「不燃ごみ」扱いになります。可能な限り洗って資源にしましょう。',
    lucideIcon: 'Container',
    difficulty: 'INSANE'
  },
  {
    id: 'mirror-broken',
    name: '割れた鏡',
    category: 'NON_BURNABLE',
    hint: 'ガラスの裏に金属が塗ってある。割れているので回収時の危険に注意。',
    explanation: '鏡はガラスの裏面にアルミニウムなどの金属を蒸着させているため、通常のガラス瓶などの資源にはならず「不燃ごみ」になります。割れている場合は厚紙や新聞紙で厳重に包み、外側に「キケン 鏡」と表記して出すのがマナーです。',
    lucideIcon: 'Sparkles',
    difficulty: 'MEDIUM'
  },
  {
    id: 'umbrella-vinyl',
    name: '壊れたビニール傘',
    category: 'NON_BURNABLE',
    hint: '金属の骨組みとビニールシートの組み合わせ。長いけれど…？',
    explanation: 'ビニール傘は金属とプラスチック（ビニール）の複合製品であり、多くの自治体で「不燃ごみ」に分類されます。指定袋からはみ出しても「傘」は例外として回収してくれる自治体が多いですが、一部では骨組み（不燃）とビニール（可燃）に分解することを推奨しています。',
    lucideIcon: 'Umbrella',
    difficulty: 'MEDIUM'
  },
  {
    id: 'felt-tip-pen',
    name: '使い切った蛍光ペン',
    category: 'BURNABLE',
    hint: '本体はプラスチックで、中にインクを染み込ませた綿が入っている。',
    explanation: '蛍光ペンやボールペンなどの文房具は大部分がプラスチックで、内部にインク芯などが入っていますが、サイズが小さく有害物質も含まないため、基本的には「可燃ごみ」に分類されます。',
    lucideIcon: 'Lightbulb',
    difficulty: 'MEDIUM'
  },
  {
    id: 'diaper-used',
    name: '使用済みの紙おむつ',
    category: 'BURNABLE',
    hint: '水分を吸収してずっしり重い。出す時のマナーがとても大切。',
    explanation: '紙おむつは「可燃ごみ」です。ただし、汚物（便）は必ずトイレに流して取り除き、おむつを小さく丸めて、臭いが漏れないようにしっかりと袋を縛って可燃ごみに出すのが重要なエチケットです。',
    lucideIcon: 'Package',
    difficulty: 'EASY'
  },
  {
    id: 'diatomaceous-earth-mat',
    name: '珪藻土バスマット（無破損）',
    category: 'OVERSIZED',
    hint: 'お風呂上がりの足をすぐ乾かしてくれるマット。割れていなくても大きいよ。',
    explanation: '一般家庭から出る一辺30cm〜50cm以上の珪藻土バスマットは「粗大ごみ」に分類されます（割れて袋に入れば不燃ごみの場合も）。ただし、一部の海外製アスベスト含有問題対象製品については、自治体回収不可で販売元やメーカーが特別回収を行うルールがあります。',
    lucideIcon: 'Grid',
    difficulty: 'INSANE'
  }
];
