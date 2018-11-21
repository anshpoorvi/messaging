 #********Define archive name and version**********#
 ARCHIVENAME='messaging'
 ARCHIVEVERSION=1.0.7
 #******************#
 YELLOW='\033[1;33m'
 RED='\033[1;31m'
 GREEN='\033[1;32m'
 RESET='\033[0m'

# indent text on echo
function indent() {
  c='s/^/       /'
  case $(uname) in
    Darwin) sed -l "$c";;
    *)      sed -u "$c";;
  esac
}
function showStep ()
    {
        echo -e "${YELLOW}=====================================================" | indent
        echo -e "${RESET}-----> $*" | indent
        echo -e "${YELLOW}=====================================================${RESET}" | indent
    }
showStep "installing network"
composer network install --card PeerAdmin@hlfv1 --archiveFile ${ARCHIVENAME}@${ARCHIVEVERSION}.bna

showStep "staring network"
composer network start --networkName ${ARCHIVENAME} --networkVersion ${ARCHIVEVERSION} --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv1 --file networkadmin.card

showStep "Importing Card"
composer card import --file networkadmin.card
showStep "Pinging network"
composer network ping --card admin@${ARCHIVENAME}
showStep "start up complete"