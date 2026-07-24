# Brief — Spanish P0 index translation (2026-07-24)

## Scope

- **Source of truth:** `public/data/philosophers.index.json`
- **Eligibility:** has `oneLineEn` + `keywordsEn` with `keywordsEn.length === keywordsZh.length`
- **Count:** 361 / 542 index entries
- **Fields:** `oneLineZh` → `oneLineEs`, `keywordsZh` → `keywordsEs`
- **English role:** terminology reference only (not a substitute for Chinese source)
- **Out of scope:** 181 entries without locked EN (includes un-admitted EN rework batches 024–026 and Chinese template debt)

## Output

| File | Role |
|------|------|
| `patch.philosophers.es.json` | Offline Spanish patch (`schemaVersion: 1`, id → `oneLineEs` / `keywordsEs`) |
| `glossary.es.json` | Core term choices (zh → es) |
| `notes.md` | Producer line, open questions, process notes |
| `brief.md` | This range contract |

## Id list (361)

| id | names.en | kw count |
|----|----------|----------|
| `confucius` | Confucius | 3 |
| `laozi` | Laozi | 3 |
| `zhuangzi` | Zhuangzi | 3 |
| `buddha` | Gautama Buddha | 6 |
| `plato` | Plato | 3 |
| `aristotle` | Aristotle | 3 |
| `kant` | Immanuel Kant | 3 |
| `rawls` | John Rawls | 3 |
| `cleanthes` | Cleanthes | 3 |
| `chrysippus` | Chrysippus | 3 |
| `diogenes-sinope` | Diogenes of Sinope | 3 |
| `antisthenes` | Antisthenes | 3 |
| `pythagoras` | Pythagoras | 3 |
| `anaximander` | Anaximander | 3 |
| `anaximenes` | Anaximenes | 3 |
| `xenophanes` | Xenophanes | 3 |
| `empedocles` | Empedocles | 3 |
| `anaxagoras` | Anaxagoras | 3 |
| `zeno-elea` | Zeno of Elea | 3 |
| `democritus` | Democritus | 3 |
| `protagoras` | Protagoras | 3 |
| `gorgias` | Gorgias | 3 |
| `pyrrho` | Pyrrho | 3 |
| `theophrastus` | Theophrastus | 3 |
| `carneades` | Carneades | 3 |
| `cicero` | Cicero | 3 |
| `lucretius` | Lucretius | 3 |
| `seneca` | Seneca the Younger | 3 |
| `epictetus` | Epictetus | 3 |
| `marcus-aurelius` | Marcus Aurelius | 3 |
| `fichte` | Johann Gottlieb Fichte | 5 |
| `schelling` | Friedrich Wilhelm Joseph Schelling | 5 |
| `feuerbach` | Ludwig Andreas Feuerbach | 5 |
| `pascal` | Blaise Pascal | 5 |
| `peirce` | Charles Sanders Peirce | 5 |
| `james` | William James | 5 |
| `du-bois` | W. E. B. Du Bois | 5 |
| `moore` | George Edward Moore | 5 |
| `popper` | Karl Popper | 5 |
| `kuhn` | Thomas Kuhn | 5 |
| `dilthey` | Wilhelm Dilthey | 5 |
| `gadamer` | Hans-Georg Gadamer | 5 |
| `jaspers` | Karl Jaspers | 5 |
| `sextus-empiricus` | Sextus Empiricus | 5 |
| `duns-scotus` | John Duns Scotus | 5 |
| `al-kindi` | al-Kindi | 5 |
| `suhrawardi` | Shihab al-Din Suhrawardi | 5 |
| `ibn-arabi` | Ibn ʿArabi | 5 |
| `han-feizi` | Han Fei | 5 |
| `huineng` | Huineng | 5 |
| `zhang-zai` | Zhang Zai | 5 |
| `dignaga` | Dignāga | 5 |
| `wollstonecraft` | Mary Wollstonecraft | 4 |
| `anscombe` | G. E. M. Anscombe | 4 |
| `rosenzweig` | Franz Rosenzweig | 4 |
| `fanon` | Frantz Fanon | 4 |
| `freire` | Paulo Freire | 4 |
| `horkheimer` | Max Horkheimer | 4 |
| `adorno` | Theodor W. Adorno | 4 |
| `benjamin` | Walter Benjamin | 5 |
| `cohen` | Hermann Cohen | 5 |
| `eckhart` | Meister Eckhart | 5 |
| `cusa` | Nicholas of Cusa | 5 |
| `vico` | Giambattista Vico | 5 |
| `herder` | Johann Gottfried Herder | 5 |
| `iqbal` | Muhammad Iqbal | 5 |
| `dharmakirti` | Dharmakīrti | 5 |
| `shinran` | Shinran | 5 |
| `cheng-yi` | Cheng Yi | 5 |
| `feng-youlan` | Feng Youlan | 5 |
| `mou-zongsan` | Mou Zongsan | 5 |
| `simone-weil` | Simone Weil | 5 |
| `mariategui` | José Carlos Mariátegui | 5 |
| `zera-yacob` | Zera Yacob | 5 |
| `walda-heywat` | Walda Heywat | 5 |
| `edward-blyden` | Edward Wilmot Blyden | 5 |
| `nkrumah` | Kwame Nkrumah | 5 |
| `macintyre` | Alasdair MacIntyre | 5 |
| `rorty` | Richard Rorty | 5 |
| `kripke` | Saul Kripke | 5 |
| `putnam` | Hilary Putnam | 5 |
| `davidson` | Donald Davidson | 5 |
| `deleuze` | Gilles Deleuze | 5 |
| `ricoeur` | Paul Ricoeur | 5 |
| `weber` | Max Weber | 5 |
| `nishitani` | Keiji Nishitani | 5 |
| `radhakrishnan` | Sarvepalli Radhakrishnan | 5 |
| `madhva` | Madhva | 5 |
| `charles-taylor` | Charles Taylor | 5 |
| `bentham` | Jeremy Bentham | 5 |
| `comte` | Auguste Comte | 5 |
| `schleiermacher` | Friedrich Schleiermacher | 5 |
| `reid` | Thomas Reid | 5 |
| `tocqueville` | Alexis de Tocqueville | 5 |
| `gramsci` | Antonio Gramsci | 5 |
| `lukacs` | György Lukács | 5 |
| `bloch` | Ernst Bloch | 5 |
| `marcuse` | Herbert Marcuse | 5 |
| `fromm` | Erich Fromm | 5 |
| `berlin` | Isaiah Berlin | 5 |
| `hayek` | Friedrich Hayek | 5 |
| `schmitt` | Carl Schmitt | 5 |
| `croce` | Benedetto Croce | 5 |
| `yan-hui` | Yan Hui | 3 |
| `zengzi` | Zengzi | 3 |
| `zisi` | Zisi | 3 |
| `zigong` | Zigong | 3 |
| `shang-yang` | Shang Yang | 3 |
| `shen-buhai` | Shen Buhai | 3 |
| `shen-dao` | Shen Dao | 3 |
| `hui-shi` | Hui Shi | 3 |
| `gongsun-long` | Gongsun Long | 3 |
| `yang-zhu` | Yang Zhu | 3 |
| `xu-xing` | Xu Xing | 3 |
| `zou-yan` | Zou Yan | 3 |
| `song-xing` | Song Xing | 3 |
| `yin-wen` | Yin Wen | 3 |
| `guan-zhong` | Guan Zhong | 3 |
| `yan-ying` | Yan Ying | 3 |
| `sunzi` | Sunzi | 3 |
| `wu-qi` | Wu Qi | 3 |
| `lu-buwei` | Lü Buwei | 3 |
| `li-si` | Li Si | 3 |
| `dong-zhongshu` | Dong Zhongshu | 3 |
| `yang-xiong` | Yang Xiong | 3 |
| `wang-chong` | Wang Chong | 3 |
| `liu-an` | Liu An | 3 |
| `lu-jia` | Lu Jia | 3 |
| `jia-yi` | Jia Yi | 3 |
| `sima-tan` | Sima Tan | 3 |
| `sima-qian` | Sima Qian | 3 |
| `huan-tan` | Huan Tan | 3 |
| `zheng-xuan` | Zheng Xuan | 3 |
| `xu-gan` | Xu Gan | 3 |
| `wang-fu` | Wang Fu | 3 |
| `xun-yue` | Xun Yue | 3 |
| `zhongchang-tong` | Zhongchang Tong | 3 |
| `liu-xiang` | Liu Xiang | 3 |
| `liu-xin` | Liu Xin | 3 |
| `he-yan` | He Yan | 3 |
| `ruan-ji` | Ruan Ji | 3 |
| `ji-kang` | Ji Kang | 3 |
| `xiang-xiu` | Xiang Xiu | 3 |
| `pei-wei` | Pei Wei | 3 |
| `ge-hong` | Ge Hong | 3 |
| `fan-zhen` | Fan Zhen | 3 |
| `tao-hongjing` | Tao Hongjing | 3 |
| `lu-xiujing` | Lu Xiujing | 3 |
| `kou-qianzhi` | Kou Qianzhi | 3 |
| `cheng-xuanying` | Cheng Xuanying | 3 |
| `dao-an` | Dao An | 3 |
| `huiyuan` | Huiyuan | 3 |
| `daosheng` | Daosheng | 3 |
| `jizang` | Jizang | 3 |
| `xuanzang` | Xuanzang | 3 |
| `kuiji` | Kuiji | 3 |
| `daoxuan` | Daoxuan | 3 |
| `tanluan` | Tanluan | 3 |
| `shandao` | Shandao | 3 |
| `zongmi` | Zongmi | 3 |
| `yanshou` | Yanshou | 3 |
| `han-yu` | Han Yu | 3 |
| `li-ao` | Li Ao | 3 |
| `liu-zongyuan` | Liu Zongyuan | 3 |
| `li-gou` | Li Gou | 3 |
| `hu-yuan` | Hu Yuan | 3 |
| `shao-yong` | Shao Yong | 3 |
| `sima-guang` | Sima Guang | 3 |
| `su-shi` | Su Shi | 3 |
| `luo-congyan` | Luo Congyan | 3 |
| `hu-hong` | Hu Hong | 3 |
| `zhang-shi` | Zhang Shi | 3 |
| `chen-liang` | Chen Liang | 3 |
| `ye-shi` | Ye Shi | 3 |
| `wu-cheng` | Wu Cheng | 3 |
| `xu-heng` | Xu Heng | 3 |
| `wu-yubi` | Wu Yubi | 3 |
| `chen-xianzhang` | Chen Xianzhang | 3 |
| `xue-xuan` | Xue Xuan | 3 |
| `luo-qinshun` | Luo Qinshun | 3 |
| `wang-tingxiang` | Wang Tingxiang | 3 |
| `zhan-ruoshui` | Zhan Ruoshui | 3 |
| `wang-gen` | Wang Gen | 3 |
| `luo-rufang` | Luo Rufang | 3 |
| `li-zhi` | Li Zhi | 3 |
| `gu-xiancheng` | Gu Xiancheng | 3 |
| `gao-panlong` | Gao Panlong | 3 |
| `liu-zongzhou` | Liu Zongzhou | 3 |
| `huang-zongxi` | Huang Zongxi | 3 |
| `gu-yanwu` | Gu Yanwu | 3 |
| `fang-yizhi` | Fang Yizhi | 3 |
| `chen-que` | Chen Que | 3 |
| `tang-zhen` | Tang Zhen | 3 |
| `yan-yuan-qing` | Yan Yuan | 3 |
| `li-gong-qing` | Li Gong | 3 |
| `lu-longqi` | Lu Longqi | 3 |
| `mao-qiling` | Mao Qiling | 3 |
| `zhang-xuecheng` | Zhang Xuecheng | 3 |
| `cui-shu` | Cui Shu | 3 |
| `ruan-yuan` | Ruan Yuan | 3 |
| `jiao-xun` | Jiao Xun | 3 |
| `gong-zizhen` | Gong Zizhen | 3 |
| `wei-yuan` | Wei Yuan | 3 |
| `voltaire` | Voltaire | 3 |
| `diderot` | Denis Diderot | 3 |
| `montesquieu` | Montesquieu | 3 |
| `condillac` | Étienne Bonnot de Condillac | 3 |
| `condorcet` | Marquis de Condorcet | 3 |
| `holbach` | Baron d’Holbach | 3 |
| `helvetius` | Claude Adrien Helvétius | 3 |
| `la-mettrie` | Julien Offray de La Mettrie | 3 |
| `malebranche` | Nicolas Malebranche | 3 |
| `gassendi` | Pierre Gassendi | 3 |
| `pierre-bayle` | Pierre Bayle | 3 |
| `maine-de-biran` | Maine de Biran | 3 |
| `victor-cousin` | Victor Cousin | 3 |
| `renouvier` | Charles Renouvier | 3 |
| `ravaisson` | Félix Ravaisson | 3 |
| `boutroux` | Émile Boutroux | 3 |
| `badarayana` | Bādarāyaṇa | 3 |
| `kapila-ishvarakrishna` | Īśvarakṛṣṇa / Kapila tradition | 3 |
| `aksapada-gautama` | Akṣapāda Gautama | 3 |
| `bhartrhari` | Bhartṛhari | 3 |
| `kumarila-bhatta` | Kumārila Bhaṭṭa | 3 |
| `udayana` | Udayana | 3 |
| `gangesa` | Gaṅgeśa | 3 |
| `abhinavagupta` | Abhinavagupta | 3 |
| `vivekananda` | Swami Vivekananda | 3 |
| `aurobindo` | Sri Aurobindo | 3 |
| `kukai` | Kūkai | 3 |
| `honen` | Hōnen | 3 |
| `nichiren` | Nichiren | 3 |
| `hakuin` | Hakuin Ekaku | 3 |
| `ito-jinsai` | Itō Jinsai | 3 |
| `ogyu-sorai` | Ogyū Sorai | 3 |
| `motoori-norinaga` | Motoori Norinaga | 3 |
| `fukuzawa-yukichi` | Fukuzawa Yukichi | 3 |
| `kuki-shuzo` | Kuki Shūzō | 3 |
| `tanabe-hajime` | Tanabe Hajime | 3 |
| `wonhyo` | Wonhyo | 3 |
| `jinul` | Jinul | 3 |
| `seo-gyeongdeok` | Seo Gyeongdeok | 3 |
| `yi-ik` | Yi Ik | 3 |
| `jeong-yakyong` | Jeong Yakyong | 3 |
| `santaraksita` | Śāntarakṣita | 3 |
| `kamalasila` | Kamalaśīla | 3 |
| `atisa` | Atiśa Dīpaṃkara Śrījñāna | 3 |
| `milarepa` | Milarepa | 3 |
| `gampopa` | Gampopa | 3 |
| `sakya-pandita` | Sakya Paṇḍita | 3 |
| `longchenpa` | Longchenpa | 3 |
| `tsongkhapa` | Tsongkhapa | 3 |
| `dolpopa` | Dolpopa Sherab Gyaltsen | 3 |
| `gorampa` | Gorampa Sonam Senge | 3 |
| `buton` | Butön Rinchen Drub | 3 |
| `jamgon-kongtrul` | Jamgön Kongtrul Lodrö Tayé | 3 |
| `mipham` | Mipham Gyatso | 3 |
| `dalai-lama-14` | 14th Dalai Lama | 3 |
| `wasil-ibn-ata` | Wāṣil ibn ʿAṭāʾ | 3 |
| `al-ashari` | Abū al-Ḥasan al-Ashʿarī | 3 |
| `al-maturidi` | Abū Manṣūr al-Māturīdī | 3 |
| `al-baqillani` | Abū Bakr al-Bāqillānī | 3 |
| `al-juwayni` | Imām al-Ḥaramayn al-Juwaynī | 3 |
| `fakhr-al-din-al-razi` | Fakhr al-Dīn al-Rāzī | 3 |
| `abu-bakr-al-razi` | Abū Bakr Muḥammad ibn Zakariyyāʾ al-Rāzī | 3 |
| `miskawayh` | Aḥmad ibn Muḥammad Miskawayh | 3 |
| `ibn-bajja` | Ibn Bājja / Avempace | 3 |
| `ibn-tufayl` | Ibn Ṭufayl / Abubacer | 3 |
| `ibn-hazm` | Ibn Ḥazm | 3 |
| `nasir-al-din-tusi` | Naṣīr al-Dīn al-Ṭūsī | 3 |
| `rabia-al-adawiyya` | Rābiʿa al-ʿAdawiyya | 3 |
| `al-junayd` | al-Junayd of Baghdad | 3 |
| `al-hallaj` | al-Ḥallāj | 3 |
| `rumi` | Jalāl al-Dīn Rūmī | 3 |
| `nasir-khusraw` | Nāṣir-i Khusraw | 3 |
| `ibn-taymiyya` | Ibn Taymiyya | 3 |
| `mir-damad` | Mīr Dāmād | 3 |
| `tabatabai` | Sayyid Muḥammad Ḥusayn Ṭabāṭabāʾī | 3 |
| `al-afghani` | Jamāl al-Dīn al-Afghānī | 3 |
| `muhammad-abduh` | Muḥammad ʿAbduh | 3 |
| `fazlur-rahman` | Fazlur Rahman | 3 |
| `seyyed-hossein-nasr` | Seyyed Hossein Nasr | 3 |
| `philo-of-alexandria` | Philo of Alexandria | 3 |
| `isaac-israeli` | Isaac Israeli | 3 |
| `ibn-gabirol` | Solomon Ibn Gabirol | 3 |
| `bahya-ibn-paquda` | Bahya ibn Paquda | 3 |
| `judah-halevi` | Judah Halevi | 3 |
| `abraham-ibn-daud` | Abraham Ibn Daud | 3 |
| `gersonides` | Gersonides | 3 |
| `hasdai-crescas` | Hasdai Crescas | 3 |
| `joseph-albo` | Joseph Albo | 3 |
| `nachmanides` | Nachmanides | 3 |
| `moses-de-leon` | Moses de León | 3 |
| `abraham-abulafia` | Abraham Abulafia | 3 |
| `isaac-luria` | Isaac Luria | 3 |
| `baal-shem-tov` | Baal Shem Tov | 3 |
| `schneur-zalman` | Shneur Zalman of Liadi | 3 |
| `moses-mendelssohn` | Moses Mendelssohn | 3 |
| `gershom-scholem` | Gershom Scholem | 3 |
| `abraham-joshua-heschel` | Abraham Joshua Heschel | 3 |
| `joseph-soloveitchik` | Joseph B. Soloveitchik | 3 |
| `mordecai-kaplan` | Mordecai M. Kaplan | 3 |
| `yeshayahu-leibowitz` | Yeshayahu Leibowitz | 3 |
| `las-casas` | Bartolomé de las Casas | 3 |
| `andres-bello` | Andrés Bello | 3 |
| `simon-rodriguez` | Simón Rodríguez | 3 |
| `alberdi` | Juan Bautista Alberdi | 3 |
| `sarmiento` | Domingo Faustino Sarmiento | 3 |
| `hostos` | Eugenio María de Hostos | 3 |
| `gabino-barreda` | Gabino Barreda | 3 |
| `jose-marti` | José Martí | 3 |
| `jose-enrique-rodo` | José Enrique Rodó | 3 |
| `antonio-caso` | Antonio Caso | 3 |
| `jose-vasconcelos` | José Vasconcelos | 3 |
| `alejandro-korn` | Alejandro Korn | 3 |
| `samuel-ramos` | Samuel Ramos | 3 |
| `francisco-romero` | Francisco Romero | 3 |
| `risieri-frondizi` | Risieri Frondizi | 3 |
| `salazar-bondy` | Augusto Salazar Bondy | 3 |
| `ignacio-ellacuria` | Ignacio Ellacuría | 3 |
| `gustavo-gutierrez` | Gustavo Gutiérrez | 3 |
| `rodolfo-kusch` | Rodolfo Kusch | 3 |
| `anibal-quijano` | Aníbal Quijano | 3 |
| `maria-lugones` | María Lugones | 3 |
| `octavio-paz` | Octavio Paz | 3 |
| `basil-the-great` | Basil the Great | 4 |
| `gregory-of-nazianzus` | Gregory of Nazianzus | 4 |
| `gregory-of-nyssa` | Gregory of Nyssa | 4 |
| `pseudo-dionysius` | Pseudo-Dionysius the Areopagite | 4 |
| `maximus-the-confessor` | Maximus the Confessor | 4 |
| `john-of-damascus` | John of Damascus | 4 |
| `symeon-the-new-theologian` | Symeon the New Theologian | 4 |
| `michael-psellos` | Michael Psellos | 4 |
| `gregory-palamas` | Gregory Palamas | 4 |
| `gemistos-plethon` | Gemistos Plethon | 4 |
| `zoroaster` | Zoroaster | 4 |
| `mani` | Mani | 4 |
| `pyotr-chaadaev` | Pyotr Chaadaev | 4 |
| `aleksei-khomyakov` | Aleksei Khomyakov | 4 |
| `ivan-kireevsky` | Ivan Kireevsky | 4 |
| `alexander-herzen` | Alexander Herzen | 4 |
| `mikhail-bakunin` | Mikhail Bakunin | 4 |
| `nikolai-chernyshevsky` | Nikolai Chernyshevsky | 4 |
| `peter-kropotkin` | Peter Kropotkin | 4 |
| `fyodor-dostoevsky` | Fyodor Dostoevsky | 4 |
| `leo-tolstoy` | Leo Tolstoy | 4 |
| `vladimir-solovyov` | Vladimir Solovyov | 4 |
| `nikolai-fedorov` | Nikolai Fedorov | 4 |
| `lev-shestov` | Lev Shestov | 4 |
| `nikolai-berdyaev` | Nikolai Berdyaev | 4 |
| `sergei-bulgakov` | Sergei Bulgakov | 4 |
| `pavel-florensky` | Pavel Florensky | 4 |
| `semyon-frank` | Semyon Frank | 4 |
| `buddhaghosa` | Buddhaghosa | 4 |
| `dhammapala` | Dhammapala | 4 |
| `ledi-sayadaw` | Ledi Sayadaw | 4 |
| `mahasi-sayadaw` | Mahasi Sayadaw | 4 |
| `buddhadasa` | Buddhadasa | 4 |
| `tran-thai-tong` | Trần Thái Tông | 4 |
| `tran-nhan-tong` | Trần Nhân Tông | 4 |
| `le-quy-don` | Lê Quý Đôn | 4 |

## Branch note

Working tree had unrelated dirty admit/upgrade changes at execution time. Spanish work stayed **offline only** under this directory; no switch onto a mixed branch, no writes to `public/data`.
