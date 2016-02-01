import os
from plasma import yamlio, protein
from plasma.obtypes import obmap, oblist

TREATMENT_ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
COIN_BASE_DIR = "mutualVision/images/coins"
COINS_ROOT = os.path.join(TREATMENT_ROOT, 'share', COIN_BASE_DIR)
COIN_DIRS = os.listdir(COINS_ROOT)


def ingest_default_shaders(protein):
    defaultShaders = {
            'path': {
                'fragment':'ribbons.frag',
                'vertex':'ribbons.vert'
                },
            'point': {
                'fragment':'network.frag',
                'vertex':'network.vert'
                }
            }

    protein.update_ingests(default_shaders=defaultShaders) 
    return


def ingest_hover(protein):
    defaultHover = {
            'max-found':256,
            'min_zoom':1.0,
            'glyph': 'sluice/sharkmouth.png'
            }
    protein.update_ingests(hover=defaultHover)
    return


def ingest_boilerplate(protein, name):
    #protein.update_ingests(**{'display-text':'{ ' + name + ' }'})
    protein.update_ingests(**{'display-text':name})
    protein.update_ingests(name=name.replace(' ', '-').lower())

    #Make this customizable
    protein.update_ingests(icon='mutualVision/images/loanicon.png')

    #Make this customizable
    protein.update_ingests(type='network')


    ingest_default_shaders(protein)
    ingest_hover(protein)
    return


def ingest_kinds(protein, kinds):
    protein.update_ingests(kinds=kinds)
    return


def ingest_pigments(protein, pigments):
    protein.update_ingests(pigments=pigments)
    return


def build_enable_menu():
    enableMenu = {
            'name':'enable-menu',
            'selection-type':'exclusive',
            'contents': [{
                'name': True,
                'display-text': 'Enable',
                'selected': True
                },
                {
                'name': False,
                'display-text': 'Disable',
                'selected': False
                }]
                }

    return enableMenu


def build_opacity():
    opacity = {
            'name': 'opacity',
            'selection-type': 'exclusive',
            'contents': [{
                'name': '0.25',
                'display-text': '25%',
                'selected': 0,
                },
                {
                'name': '0.50',
                'display-text': '50%',
                'selected': 0,
                },
                {
                'name': '0.75',
                'display-text': '75%',
                'selected': 0,
                },
                {
                'name': '1.00',
                'display-text': '100%',
                'selected': 1,
                }]
            }
    return opacity


def build_enabled_kinds(protein, kinds):
    enabledKinds = {
            'name': 'enabled-kinds',
            'display-text': 'Filter Options',
            'selection-type': 'inclusive',
            'contents': []
            }
    for kind in kinds:
        enabledKind = {'name':kind, 'display-text':kind, 'selected':True}
        enabledKinds['contents'].append(enabledKind)

    return enabledKinds


def ingest_attributes(protein, kinds):
    attributes = []
    #Make this customizable
    attributes.append(build_enable_menu())
    #Make this customizable
    attributes.append(build_opacity())

    attributes.append(build_enabled_kinds(protein, kinds))

    protein.update_ingests(attributes=attributes)
    return


def gen_ingests(fluoroProtein, name, kinds, pigments):
    ingest_boilerplate(fluoroProtein, name)
    ingest_kinds(fluoroProtein, kinds)
    ingest_pigments(fluoroProtein, pigments)
    ingest_attributes(fluoroProtein, kinds)
    return


def get_kinds(resources):
    return resources.keys()


def get_pigments(resources):
    SIZE_VALUE = 1.0
    SIZE_TYPE = 'SoftFloat'
    TYPE = 'point'
    COLOR_WHITE = [ 1.0, 1.0, 1.0, 1.0 ] #RGBA

    pigments = []
    for name, resource in resources.iteritems():
        for icon in resource:
            iconName, fileExt = os.path.splitext(os.path.basename(icon))
            pigment = {
                    'name':iconName, 
                    'icon':COIN_BASE_DIR + '/' + name + '/' + icon,
                    'type':TYPE,
                    'size': {
                        'type':SIZE_TYPE,
                        'value':SIZE_VALUE
                        },
                    'color': {
                        'type': 'SoftColor',
                        'value': oblist(COLOR_WHITE) 
                        }
                    }
            pigments.append(pigment)
    return pigments


def gen_fluoroscope(fluoroName, resources):
    fluoroProtein = protein.Protein()
    fluoroProtein.set_descrips('sluice','prot-spec v1.0','request','new-fluoro-template')

    gen_ingests(fluoroProtein, fluoroName, get_kinds(resources), get_pigments(resources))
    return fluoroProtein
    

def update_inculcators(protein, pigments, resources):
    inculcators = protein.ingests()['inculcators']

    for kind, resource in resources.iteritems():
        for icon in resource:
            iconName, fileExt = os.path.splitext(os.path.basename(icon))
            inculcatorName = iconName + '_inc'
            if(not any(d['name'] == inculcatorName for d in inculcators)):
                inculcator = {
                        'name': inculcatorName, 
                        'kinds': [ kind ],
                        'pigment': iconName,
                        'jstest' : "parseInt(observation(n, 'Coins', t)) == " + iconName.split('-')[-1]
                        }
                inculcators.append(inculcator)
    protein.update_ingests(inculcators=inculcators)
    return


def main():
    coinFiles = {}
    fluoroFilename = os.path.join(os.path.dirname(__file__), '..', '..', 'etc', 'mutualVision', 'loan.protein')
    inculcatorsFilename = os.path.join(os.path.dirname(__file__), '..', '..', 'etc', 'mutualVision', 'inculcators.protein')

    for theDir in COIN_DIRS:
	coinFiles[theDir] = os.listdir(COINS_ROOT + '/' + theDir)

    fluoroName = 'Loans'
    fluoroProtein = gen_fluoroscope(fluoroName, coinFiles)
    
    #fluoroFilename = fluoroName.replace(' ', '-').lower() + '-fluoro.protein'
    proteinFile = file(fluoroFilename, 'w')
    proteinFile.write(yamlio.dump_yaml_protein(fluoroProtein))


    inculcatorsProtein = yamlio.parse_yaml_protein(file(inculcatorsFilename, 'r'))

    update_inculcators(inculcatorsProtein, fluoroProtein, coinFiles)

    inculcatorFile = file(inculcatorsFilename, 'w')
    inculcatorFile.write(yamlio.dump_yaml_protein(inculcatorsProtein))

    return


if __name__ == '__main__':
    main()
