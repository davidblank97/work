<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language[@localeID='en-CA']/text[@id='54']/content">
		<content>AMPERAGE</content>
	</xsl:template>
	<xsl:template match="/language[@localeID='en-CA']/text[@id='405']/content">
		<content>PRIMARY CURRENT</content>
	</xsl:template>
	<xsl:template match="/language[@localeID='en-CA']/text[@id='406']/content">
		<content>BACKGROUND CURRENT</content>
	</xsl:template>
	<xsl:template match="/language[@localeID='en-CA']/text[@id='407']/content">
		<content>AVERAGE CURRENT</content>
	</xsl:template>
	<xsl:template match="/language[@localeID='en-CA']/text[@id='65545']/content">
		<content>Enter the rated shunt current and voltage (mV) in the input fields above.</content>
	</xsl:template>


	<xsl:template match="/language[@localeID='fr-FR']">
		<language name="FRENCH" localeID="fr-FR" localeCode="1036" font="LiburdiBold.ttf#Liburdi Osprey">
			<metadata>
				<schema_version/>
				<config_version>1.6.2.5</config_version>
				<author>Liburdi Automation</author>
				<date>12/17/2020</date>
			</metadata>
			<!--Labels-->
			<text id="1">
				<content>START</content>
				<desc>A button label that starts a sequence (in weld/test mode).</desc>
			</text>
			<text id="2">
				<content>STOP</content>
				<desc>A button label that stops a weld, test, etc.</desc>
			</text>
			<text id="3">
				<content>SOUDAGE</content>
				<desc>One of the two weld modes. In this mode the power supply outputs current and a weld is started when the START button is pressed.</desc>
			</text>
			<text id="4">
				<content>TEST</content>
				<desc>One of the two weld modes. In this mode the power supply is not activated and only the movement of the weld head is activated when the START button is pressed.</desc>
			</text>
			<text id="5">
				<content>AVANCE</content>
				<desc>Skip to the next segment (segment is a part of a weld procedure).</desc>
			</text>
			<text id="6">
				<content>MISE EN PAGE</content>
				<desc>A button that allows the user to edit the screen's layout.</desc>
			</text>
			<text id="7">
				<content>GAZ</content>
				<desc>A button that turns gas/coolant flow on or off.</desc>
			</text>
			<text id="8">
				<content>RAPPEL</content>
				<desc>To load a program or file.</desc>
			</text>
			<text id="9">
				<content>SAUVE</content>
				<desc>To save a program or file.</desc>
			</text>
			<text id="10">
				<content>ENREGISTRER SOUS</content>
				<desc>To save a program or file with a new name.</desc>
			</text>
			<text id="11">
				<content>MARCHE A VIDE</content>
				<desc>To move an axis of a robot in a continuous motion, usually to position that axis.</desc>
			</text>
			<text id="12">
				<content>PAS</content>
				<desc>To move an axis of a robot a given distance and then stop, usually to position that axis.</desc>
			</text>
			<text id="13">
				<content>TETE</content>
				<desc>Refers to the part of the robot that moves and welds.</desc>
			</text>
			<text id="14">
				<content>PROGRAMME</content>
				<desc>A program that the welding robot runs. A collection of welding parameters, organized into segments, that define how the weld should be executed.</desc>
			</text>
			<text id="15">
				<content>PROGRAMMES</content>
				<desc>PLURAL OF SCHEDULE</desc>
			</text>
			<text id="16">
				<content>ENCHAINEMENT PROGRAMMES</content>
				<desc>A collection of schedules (welding programs) that are to be run one after another in a sequence.</desc>
			</text>
			<text id="17">
				<content>ENCHAINEMENT DES PROGRAMMES</content>
				<desc>PLURAL OF CHAINSET</desc>
			</text>
			<text id="18">
				<content>METHODE AMORCAGE</content>
				<desc>The method in which the arc will be started or established.</desc>
			</text>
			<text id="19">
				<content>EN COURS</content>
				<desc>A label of a screen which displays real-time measurements/telemetry, set points and states of welding parameters.</desc>
			</text>
			<text id="20">
				<content>SEGMENT</content>
				<desc>A portion of a schedule (welding program) that defines what the welding parameters should be during a given time period.</desc>
			</text>
			<text id="21">
				<content>SEGMENTS</content>
				<desc>PLURAL OF SEGMENT</desc>
			</text>
			<text id="22">
				<content>GENERAL</content>
				<desc>Refers to the welding parameters in a schedule (welding program) that pertain to the start of or the entire weld, not just individual segments.</desc>
			</text>
			<text id="23">
				<content>GENERAUX</content>
				<desc>PLURAL OF GLOBAL</desc>
			</text>
			<text id="24">
				<content>CORRECTION</content>
				<desc>A parameter that determines how much a user can adjust a set point while welding.</desc>
			</text>
			<text id="25">
				<content>CORRECTIONS</content>
				<desc>PLURAL OF OVERRIDE</desc>
			</text>
			<text id="26">
				<content>VALEUR LIMITE</content>
				<desc>The amount that a welding parameter's telemetry can differ from its set point.</desc>
			</text>
			<text id="27">
				<content>VALEURS LIMITES</content>
				<desc>PLURAL OF LIMIT</desc>
			</text>
			<text id="28">
				<content>AFFICHAGE ACQUISITION</content>
				<desc>A screen that a user can use to view data collected from previous welds.</desc>
			</text>
			<text id="29">
				<content>ACQUISITION</content>
				<desc>A file that contains real-time data collected during a previous weld.</desc>
			</text>
			<text id="30">
				<content>JOURNAL DES EVENEMENTS</content>
				<desc>A file that contains a history of a user's interactions with the software.</desc>
			</text>
			<text id="31">
				<content>JOURNAL DE SUIVI</content>
				<desc>A file that details the history of what was executed by the software, used for software development.</desc>
			</text>
			<text id="32">
				<content>ACQUISITIONS</content>
				<desc>PLURAL OF DATA LOGS</desc>
			</text>
			<text id="33">
				<content>JOURNNAUX DES EVENEMENTS</content>
				<desc>PLURAL OF EVENT LOGS</desc>
			</text>
			<text id="34">
				<content>JOURNAUX DE SUIVI</content>
				<desc>PLURAL OF TRACE LOGS</desc>
			</text>
			<text id="35">
				<content>INACTIF</content>
				<desc>A state of the robot in which the robot is waiting to be started.</desc>
			</text>
			<text id="36">
				<content>POSITION DEPART</content>
				<desc>A state of the robot in which it is physically positioning itself to begin a weld.</desc>
			</text>
			<text id="37">
				<content>GAZ AVANT</content>
				<desc>A state of the robot in which gas and coolant flow is initiates for a period before the weld is started.</desc>
			</text>
			<text id="38">
				<content>AMORÇAGE ARC</content>
				<desc>A state of the robot in which the welding arc is initiated.</desc>
			</text>
			<text id="39">
				<content>PENTE</content>
				<desc>A state of the robot in which the welding parameters are smoothly transitioned to a new value.</desc>
			</text>
			<text id="40">
				<content>SOUDAGE</content>
				<desc>A state of the robot in which it is welding.</desc>
			</text>
			<text id="41">
				<content>EVANOUISSEMENT</content>
				<desc>A state of the robot in which the welding parameters are smoothly transitioned to their off value.</desc>
			</text>
			<text id="42">
				<content>GAZ APRES</content>
				<desc>A state of the robot in which gas and coolant is flowing for a period after the weld.</desc>
			</text>
			<text id="43">
				<content>POSITION FINALE</content>
				<desc>A state of the robot in which it is physically positioning itself after a weld.</desc>
			</text>
			<text id="44">
				<content>SYSTEME</content>
				<desc>Referring to the robot and all related components.</desc>
			</text>
			<text id="45">
				<content>JOURNAUX</content>
				<desc>Referring to various log files (trace logs, event logs, ect).</desc>
			</text>
			<text id="46">
				<content>PID</content>
				<desc>An acronym for Proportional–Integral–Derivative controller.</desc>
			</text>
			<text id="47">
				<content>VERSIONS</content>
				<desc>A screen that provides details on the system.</desc>
			</text>
			<text id="48">
				<content>ADMIN</content>
				<desc>Short form for 'administrative'.</desc>
			</text>
			<text id="49">
				<content>GLOBAUX</content>
				<desc>Referring to the overall settings for the system.</desc>
			</text>
			<text id="50">
				<content>UNITES</content>
				<desc>Referring to a measurement or quantity.</desc>
			</text>
			<text id="51">
				<content>SECURITE</content>
				<desc>User profiles and access levels.</desc>
			</text>
			<text id="52">
				<content>MISE A JOUR</content>
				<desc>Screen to update the software.</desc>
			</text>
			<text id="53">
				<content>ARC</content>
				<desc>Refers to a set of parameters that control the electrical characteristics of the weld.</desc>
			</text>
			<text id="54">
				<content>COURANT</content>
				<desc>Strength of electric current in amperes.</desc>
			</text>
			<text id="55">
				<content>TENSION</content>
				<desc>The difference in electric potential expressed in voltage.</desc>
			</text>
			<text id="56">
				<content>ARC PILOTE</content>
				<desc>Refers to a smaller arc that is established before the main welding arc.</desc>
			</text>
			<text id="57">
				<content>FIL CHAUD</content>
				<desc>A device that heats up welding wire before it is used to weld.</desc>
			</text>
			<text id="58">
				<content>FIL CHAUD 2</content>
				<desc>A secondary device that heats up welding wire before it is used to weld.</desc>
			</text>
			<text id="59">
				<content>AVC</content>
				<desc>An axis on the robot. Acronym for 'Automatic Height Control / control automatique hauteur'.</desc>
			</text>
			<text id="60">
				<content>ROTATION</content>
				<desc>An axis on the robot. The axis that slides along a track to move the entire robot along a length.</desc>
			</text>
			<text id="61">
				<content>ROTATION INVERSE</content>
				<desc>Same as the TRAVEL axis but referring to when it is moving in the reverse direction.</desc>
			</text>
			<text id="62">
				<content>BALAYAGE</content>
				<desc>An axis on the robot. The axis that oscillates the welding torch back and forth to create a weaving pattern.</desc>
			</text>
			<text id="63">
				<content>FIL</content>
				<desc>An axis on the robot. The axis that feeds wire from a spool into the part while welding.</desc>
			</text>
			<text id="64">
				<content>FIL 2</content>
				<desc>An axis on the robot. The secondary axis that feeds wire from a spool into the part while welding.</desc>
			</text>
			<text id="65">
				<content>AVC</content>
				<desc>An axis on the robot. Acronym for 'Automatic Voltage Control'.</desc>
			</text>
			<text id="66">
				<content>ACC</content>
				<desc>An axis on the robot. Acronym for 'Automatic Current Control'.</desc>
			</text>
			<text id="67">
				<content>THETA</content>
				<desc>An axis on the robot. The axis that tilts the torch.</desc>
			</text>
			<text id="68">
				<content>AUX</content>
				<desc>An axis on the robot. An axis or axes that is used for positioning.</desc>
			</text>
			<text id="69">
				<content>RECENT</content>
				<desc>N/A</desc>
			</text>
			<text id="70">
				<content>ACTIF</content>
				<desc>A loaded program or file.</desc>
			</text>
			<text id="71">
				<content>TOUS</content>
				<desc>N/A</desc>
			</text>
			<text id="72">
				<content>SELECTIONNER ACQUISITION</content>
				<desc>A title of a screen that selects a data log file for viewing.</desc>
			</text>
			<text id="73">
				<content>CONSIGNE</content>
				<desc>The value of a welding parameter that the robot is commanding.</desc>
			</text>
			<text id="74">
				<content>TELEMETRIE</content>
				<desc>The value of a welding parameter that is pysically measured.</desc>
			</text>
			<text id="75">
				<content>GENERATEUR</content>
				<desc>The component of the system that supplies power to weld.</desc>
			</text>
			<text id="76">
				<content>TETE DE SOUDAGE</content>
				<desc>Refers to the part of the robot that moves and hold the welding torch.</desc>
			</text>
			<text id="77">
				<content>REGLAGE PID</content>
				<desc>Refers to a screen that allows the user to tune a PID control system.</desc>
			</text>
			<text id="78">
				<content>REMISE A ZERO</content>
				<desc>N/A</desc>
			</text>
			<text id="79">
				<content>ETALONNER</content>
				<desc>Refers to comparing measured values to command values to adjust for the system's imperfections.</desc>
			</text>
			<text id="80">
				<content>LIFT ARC</content>
				<desc>Method of starting a welding arc. Where the tip of the welding torch scratches the surface of the part's surface.</desc>
			</text>
			<text id="81">
				<content>CONTACT</content>
				<desc>Method of starting a welding arc. Where the tip of the welding torch brielfy touches the surface of the part and then retracts back up.</desc>
			</text>
			<text id="82">
				<content>HAUTE FREQUENCE</content>
				<desc>Method of starting a welding arc. Where a high frequency burst of current is used to start the arc.</desc>
			</text>
			<text id="83">
				<content>MIG</content>
				<desc>A type of welding process. Acronym for 'Metal Inert Gas' welding. Also known as GMAW welding.</desc>
			</text>
			<text id="84">
				<content>PLASMA</content>
				<desc>Method of starting a welding arc. Where a small plasma arc is used to guide the main welding arc into the part.</desc>
			</text>
			<text id="85">
				<content>POWERWAVE</content>
				<desc>Refers to the Lincoln Powerwave power supply.</desc>
			</text>
			<text id="86">
				<content>COMMANDES RECUES</content>
				<desc>N/A</desc>
			</text>
			<text id="87">
				<content>SERVO</content>
				<desc>Type of electric motor.</desc>
			</text>
			<text id="88">
				<content>MOT. PAS-A-PAS</content>
				<desc>Type of electric motor.</desc>
			</text>
			<text id="89">
				<content>GENERATEUR AUXILIAIRE</content>
				<desc>Refers to auxiliary power supply. Power supplies used for functions other than outputting welding current. Example: Hot wire power supply</desc>
			</text>
			<text id="90">
				<content>GAZ/REFRIGERANT</content>
				<desc>Refers to gas and coolant.</desc>
			</text>
			<text id="91">
				<content>VITESSE</content>
				<desc>Velocity of one of the robots axis.</desc>
			</text>
			<text id="92">
				<content>POSITION</content>
				<desc>Position of one of the robots axis.</desc>
			</text>
			<text id="93">
				<content>DISTANCE</content>
				<desc>N/A.</desc>
			</text>
			<text id="94">
				<content>VITESSE</content>
				<desc>Speed of one of the robots axis.</desc>
			</text>
			<text id="95">
				<content>TEMPS</content>
				<desc>N/A</desc>
			</text>
			<text id="96">
				<content>DEBIT</content>
				<desc>Flow of gas or coolant.</desc>
			</text>
			<text id="97">
				<content>ES</content>
				<desc>Stands for Inputs and Outputs. Refers to the electrical connections between the main control board and peripheral devices.</desc>
			</text>
			<text id="98">
				<content>DIAGNOSTIC</content>
				<desc>Refers to a test done to isolate issues with the system.</desc>
			</text>
			<text id="99">
				<content>C.A.D.</content>
				<desc>A remote that is used by the welder to control the robot while welding.</desc>
			</text>
			<text id="100">
				<content>DEFAUT</content>
				<desc>N/A</desc>
			</text>
			<text id="101">
				<content>ENTREE NUMERIQUE</content>
				<desc>Refers to the electrical connections between the main control board and peripheral devices.</desc>
			</text>
			<text id="102">
				<content>SORTIE NUMERIQUE</content>
				<desc>Refers to the electrical connections between the main control board and peripheral devices.</desc>
			</text>
			<text id="103">
				<content>ENTREE ANALOGIQUE</content>
				<desc>Refers to the electrical connections between the main control board and peripheral devices.</desc>
			</text>
			<text id="104">
				<content>SORTIE ANALOGIQUE</content>
				<desc>Refers to the electrical connections between the main control board and peripheral devices.</desc>
			</text>
			<text id="105">
				<content>IMPORTER</content>
				<desc>Refers to importing files to the system.</desc>
			</text>
			<text id="106">
				<content>EXPORTER</content>
				<desc>Refers to exporting the files from the system.</desc>
			</text>
			<text id="107">
				<content>RECHERCHER</content>
				<desc>N/A</desc>
			</text>
			<text id="108">
				<content>RETOUR</content>
				<desc>N/A</desc>
			</text>
			<text id="109">
				<content>AJOUTER PROGRAMME</content>
				<desc>Refers to creating a new schedule (welding program).</desc>
			</text>
			<text id="110">
				<content>AJOUTER SEQUENCE DE PROGRAMMES</content>
				<desc>Refers to creating a new chainset (collection of welding programs).</desc>
			</text>
			<text id="111">
				<content>AJOUTER DOSSIER</content>
				<desc>Add a folder or directory to the systems file structure.</desc>
			</text>
			<text id="112">
				<content>COUPER</content>
				<desc>Refers to a cut/paste operation where a file is moved from its original location.</desc>
			</text>
			<text id="113">
				<content>COPIER</content>
				<desc>Refers to a copy/paste operation where a copy of the file is placed in the location that it is pasted.</desc>
			</text>
			<text id="114">
				<content>COLLER</content>
				<desc>To place a file that was previously copy or cut in a given location.</desc>
			</text>
			<text id="115">
				<content>RENOMMER</content>
				<desc>Rename a file.</desc>
			</text>
			<text id="116">
				<content>SUPPRIMER</content>
				<desc>Delete a file.</desc>
			</text>
			<text id="117">
				<content>TYPE DE TORCHE</content>
				<desc>The type of welding torch used by the robot. (Ex. MIG or TIG).</desc>
			</text>
			<text id="118">
				<content>SELECTIONNER</content>
				<desc>N/A</desc>
			</text>
			<text id="119">
				<content>ERREUR</content>
				<desc>N/A</desc>
			</text>
			<text id="120">
				<content>AVERTISSEMENT</content>
				<desc>N/A</desc>
			</text>
			<text id="121">
				<content>STOP</content>
				<desc>Refers to a critical error that is raised while welding.</desc>
			</text>
			<text id="122">
				<content>CONNEXION</content>
				<desc>Title of a screen used to enter in a user's credentials.</desc>
			</text>
			<text id="123">
				<content>NOM D'UTILISATEUR</content>
				<desc>The name assigned to a user to identify them.</desc>
			</text>
			<text id="124">
				<content>MOT DE PASSE</content>
				<desc>N/A</desc>
			</text>
			<text id="125">
				<content>QUITTER</content>
				<desc>N/A</desc>
			</text>
			<text id="126">
				<content>EFFACER</content>
				<desc>N/A</desc>
			</text>
			<text id="127">
				<content>VERR. MAJ.</content>
				<desc>Stands for capital lock. Sets the keyboard to a mode where only capitals can be selected on the keyboard.</desc>
			</text>
			<text id="128">
				<content>TOUCHE MAJ.</content>
				<desc>Refers to a button on the keyboard that allows the user to select a capital character on the keyboard.</desc>
			</text>
			<text id="129">
				<content>OK</content>
				<desc>N/A</desc>
			</text>
			<text id="130">
				<content>ANNULER</content>
				<desc>N/A</desc>
			</text>
			<text id="131">
				<content>SANS</content>
				<desc>N/A</desc>
			</text>
			<text id="132">
				<content>ESPACE</content>
				<desc>Button on the keyboard that outputs a blank or 'space' character.</desc>
			</text>
			<text id="133">
				<content>DESCRIPTION</content>
				<desc>N/A</desc>
			</text>
			<text id="134">
				<content>ACTIVER</content>
				<desc>N/A</desc>
			</text>
			<text id="135">
				<content>ACTIF</content>
				<desc>N/A</desc>
			</text>
			<text id="136">
				<content>MAR.</content>
				<desc>N/A</desc>
			</text>
			<text id="137">
				<content>ARR.</content>
				<desc>N/A</desc>
			</text>
			<text id="138">
				<content>DIRECTION</content>
				<desc>N/A</desc>
			</text>
			<text id="139">
				<content>INACTIF</content>
				<desc>N/A</desc>
			</text>
			<text id="140">
				<content>AVANT</content>
				<desc>N/A</desc>
			</text>
			<text id="141">
				<content>ARRIERE</content>
				<desc>N/A</desc>
			</text>
			<text id="142">
				<content>MANUEL</content>
				<desc>Refers to a state where the user must explicitly control the system. Opposite of automatic.</desc>
			</text>
			<text id="143">
				<content>ETAT</content>
				<desc>Refers to a particular condition that the system is in at a particular time.</desc>
			</text>
			<text id="144">
				<content>LANGUE</content>
				<desc>N/A</desc>
			</text>
			<text id="145">
				<content>INSERT</content>
				<desc>N/A</desc>
			</text>
			<text id="146">
				<content>ETALONNAGE</content>
				<desc>N/A</desc>
			</text>
			<text id="147">
				<content>PARAMETRES</content>
				<desc>Title for a screen that provides a list of options for the user to configure the system.</desc>
			</text>
			<text id="148">
				<content>DECONNEXION</content>
				<desc>Button label to exit the main application and return to the login screen.</desc>
			</text>
			<text id="149">
				<content>DETAILS</content>
				<desc>A setting to provide the user with an increased level of detail and data.</desc>
			</text>
			<text id="150">
				<content>ECRIRE FICHIER</content>
				<desc>A button to add extra in-depth trace logs to the file.</desc>
			</text>
			<text id="151">
				<content>ID CONTROLEUR</content>
				<desc>An identifier that is unique to a given system.</desc>
			</text>
			<text id="152">
				<content>TEMPS D'ARC ALLUME</content>
				<desc>The amount of time that a system has spent welding.</desc>
			</text>
			<text id="153">
				<content>SUIVI DE JOINT</content>
				<desc>A mode where the robot automatically tracks a groove in the part.</desc>
			</text>
			<text id="154">
				<content>FREQUENCE DE PULSATION</content>
				<desc>Welding parameter that determines the frequency at which the welding current flips to its secondary value.</desc>
			</text>
			<text id="155">
				<content>RAPPORT PULSATIONS</content>
				<desc>Welding parameter that determines how long the welding current will stay in its primary value.</desc>
			</text>
			<text id="156">
				<content>PULSATION</content>
				<desc>Refers to parameters that define the welding current's pulse characteristics.</desc>
			</text>
			<text id="157">
				<content>I(A)</content>
				<desc>Short for current.</desc>
			</text>
			<text id="158">
				<content>GAIN</content>
				<desc>Refers to a constant value multiplier.</desc>
			</text>
			<text id="159">
				<content>OFFSET</content>
				<desc>Refers to a constant value that is added to correct another value.</desc>
			</text>
			<text id="160">
				<content>COURANT</content>
				<desc>Refers to electric current.</desc>
			</text>
			<text id="161">
				<content>UTILISATEURS</content>
				<desc>PLURAL OF USER</desc>
			</text>
			<text id="162">
				<content>NIVEAUX DE SECURITE</content>
				<desc>A level a user is assigned to in order to given the user a set of permissions.</desc>
			</text>
			<text id="163">
				<content>SANS SYNCH</content>
				<desc>Short for 'No Synchronization'. </desc>
			</text>
			<text id="164">
				<content>SEQUENCE</content>
				<desc>A set of related events, movements, or things that follow each other in a particular order.</desc>
			</text>
			<text id="165">
				<content>ECARTEMENT INITIAL</content>
				<desc>The distance that the torch will raise up after the tip touches the part.</desc>
			</text>
			<text id="166">
				<content>ENERGIE</content>
				<desc>N/A</desc>
			</text>
			<text id="167">
				<content>PUISSANCE</content>
				<desc>N/A</desc>
			</text>
			<text id="168">
				<content>TEMPS REEL</content>
				<desc>Refers to a system in which input data is processed within milliseconds so that it is available virtually immediately.</desc>
			</text>
			<text id="169">
				<content>LECTURE</content>
				<desc>The reproduction of previously recorded events.</desc>
			</text>
			<text id="170">
				<content>AVT</content>
				<desc>Short for 'forward'.</desc>
			</text>
			<text id="171">
				<content>ARR</content>
				<desc>Short for 'reverse'.</desc>
			</text>
			<text id="172">
				<content>TACHO</content>
				<desc>Short for 'tachometer'. A tachometer is an instrument measuring the rotation speed of a shaft.</desc>
			</text>
			<text id="173">
				<content>EMF</content>
				<desc>A acronym for 'Electro-Motive Force'.</desc>
			</text>
			<text id="174">
				<content>RESTREINT</content>
				<desc>Preventing the user from completing a certain action due to their access rights.</desc>
			</text>
			<text id="175">
				<content>TOUS LES UTILISATEURS</content>
				<desc>Referring to all users on the system.</desc>
			</text>
			<text id="176">
				<content>POSITIF</content>
				<desc>N/A</desc>
			</text>
			<text id="177">
				<content>NEGATIF</content>
				<desc>N/A</desc>
			</text>
			<text id="178">
				<content>AUCUN PROGRAMME CHARGE</content>
				<desc>No schedule (weld program) is loaded on the system.</desc>
			</text>
			<text id="179">
				<content>AUCUNE TETE CHARGEE</content>
				<desc>No weld head is loaded on the system.</desc>
			</text>
			<text id="180">
				<content>MODE FIL CHAUD</content>
				<desc>The mode of operation for the hotwire device.</desc>
			</text>
			<text id="181">
				<content>MODE FIL CHAUD 2</content>
				<desc>The mode of operation for the hotwire2 device.</desc>
			</text>
			<text id="182">
				<content>MODE BALAYAGE</content>
				<desc>The mode in which the oscillation speed is programmed in.</desc>
			</text>
			<text id="183">
				<content>AXE</content>
				<desc>Refers to a part of the robot that can move and controlled by using a motor.</desc>
			</text>
			<text id="184">
				<content>PAR SEGMENT</content>
				<desc>Refers to a welding parameter that can have a unique value per segment as opposed to a value that remains constant for the whole schedule.</desc>
			</text>
			<text id="185">
				<content>CHARGEMENT DERNIERE SOUDURE</content>
				<desc>A prompt notifying the user that the system is loading the data logs captured during the latest weld.</desc>
			</text>
			<text id="186">
				<content>DONNEES</content>
				<desc>N/A</desc>
			</text>
			<text id="187">
				<content>COURANT FIL</content>
				<desc>The current measurement of the wire feeder motor.</desc>
			</text>
			<text id="188">
				<content>COURANT FIL 2</content>
				<desc>The current measurement of the secondary wire feeder motor.</desc>
			</text>
			<text id="189">
				<content>POSITION BALAYAGE</content>
				<desc>Short for 'Oscillator Position'. The position of the oscillation axis.</desc>
			</text>
			<text id="190">
				<content>COUCHES</content>
				<desc>N/A</desc>
			</text>
			<text id="191">
				<content>TOLERANCES PULSATION HAUTE</content>
				<desc>The range of acceptable measurements for the primary welding parameter.</desc>
			</text>
			<text id="192">
				<content>TOLERANCES PULSATION BASSE</content>
				<desc>The range of acceptable measurements for the background welding parameter.</desc>
			</text>
			<text id="193">
				<content>TOLERANCES</content>
				<desc>The range of acceptable measurements for a welding parameter.</desc>
			</text>
			<text id="194">
				<content>CONSIGNE P-HAUTE</content>
				<desc>N/A</desc>
			</text>
			<text id="195">
				<content>CONSIGNE P-BASSE</content>
				<desc>N/A</desc>
			</text>
			<text id="196">
				<content>MODE SEGMENT</content>
				<desc>The mode that defines how the segment's duration is programmed.</desc>
			</text>
			<text id="197">
				<content>MODE PULSATION</content>
				<desc>The mode that defines how the segment will pulse the welding parameters.</desc>
			</text>
			<text id="198">
				<content>BLAST</content>
				<desc>A brief burst of energy.</desc>
			</text>
			<text id="199">
				<content>LIMITES RAPPORT PULSATIONS</content>
				<desc>Limits for the PULSE WIDTH welding parameter.</desc>
			</text>
			<text id="200">
				<content>PULSATION DES AXES</content>
				<desc>Refers to parameters for pulsing axes' speeds.</desc>
			</text>
			<text id="201">
				<content>SELECTIONNER PROGRAMME</content>
				<desc>Label to select a schedule (welding program).</desc>
			</text>
			<text id="202">
				<content>AUCUN RESULTAT</content>
				<desc>There was no matching search results.</desc>
			</text>
			<text id="203">
				<content>GESTION DES PARAMETRES GENERAUX</content>
				<desc>Mode that defines how general settings are handled for the users of the system.</desc>
			</text>
			<text id="204">
				<content>PARAMETRE</content>
				<desc>N/A</desc>
			</text>
			<text id="205">
				<content>TYPE D'AFFICHAGE</content>
				<desc>The type of visual display for a parameter (graph, gauge, etc).</desc>
			</text>
			<text id="206">
				<content>NON VISIBLE</content>
				<desc>N/A</desc>
			</text>
			<text id="207">
				<content>JAUGE</content>
				<desc>A visual display that shows a chart of the parameters value over time.</desc>
			</text>
			<text id="208">
				<content>NUMERIQUE</content>
				<desc>A visual display that shows the parameters value in a pure numerical format.</desc>
			</text>
			<text id="209">
				<content>AJOUTER UNE MISE EN PAGE</content>
				<desc>Create a new layout for a given configurable screen.</desc>
			</text>
			<text id="210">
				<content>NOM</content>
				<desc>N/A</desc>
			</text>
			<text id="211">
				<content>AFFECTER UN PROCEDE SOUDAGE</content>
				<desc>Links a screen layout to a given welding process so that the layout is automatically presented when welding with the process.</desc>
			</text>
			<text id="212">
				<content>POSITION CIBLE</content>
				<desc>The position that the robot is aiming to be at.</desc>
			</text>
			<text id="213">
				<content>NIVEAU DE SECURITE AFFECTE</content>
				<desc>The security level that a user is assigned to.</desc>
			</text>
			<text id="214">
				<content>AJOUTER UTILISATEUR</content>
				<desc>Create a new user on the system.</desc>
			</text>
			<text id="215">
				<content>SUPPRIMER UTILISATEUR</content>
				<desc>Delete a user from the system.</desc>
			</text>
			<text id="216">
				<content>CHANGER MOT DE PASSE</content>
				<desc>Change the user's password.</desc>
			</text>
			<text id="217">
				<content>AJOUTER NIVEAU</content>
				<desc>Add a new security level.</desc>
			</text>
			<text id="218">
				<content>SUPPRIMER NIVEAU</content>
				<desc>Delete a security level.</desc>
			</text>
			<text id="219">
				<content>SAUVEGARDE SUR USB</content>
				<desc>Take a full copy of the current state of the software and export it to a USB storage device.</desc>
			</text>
			<text id="220">
				<content>RESTAURER SAUVEGARDE</content>
				<desc>Revert back to a previous backup of the software.</desc>
			</text>
			<text id="221">
				<content>MISE A JOUR LOGICIEL</content>
				<desc>Title of the screen that updates the software.</desc>
			</text>
			<text id="222">
				<content>IMPORTER FICHIERS</content>
				<desc>Import various files from a USB storage device.</desc>
			</text>
			<text id="223">
				<content>EXPORTER FICHIERS</content>
				<desc>Export various files to a USB storage device.</desc>
			</text>
			<text id="224">
				<content>MISES EN PAGE D'ECRANS</content>
				<desc>Refers to files that detail how a screen should look and be configured.</desc>
			</text>
			<text id="225">
				<content>DONNEES UTILISATEUR</content>
				<desc>Refers to all data pertaining to the users of a system.</desc>
			</text>
			<text id="226">
				<content>TEST FIL CHAUD</content>
				<desc>Title for a screen that tests the hotwire device.</desc>
			</text>
			<text id="227">
				<content>TEST FIL CHAUD 2</content>
				<desc>Title for a screen that tests the secondary hotwire device.</desc>
			</text>
			<text id="228">
				<content>TEST ARC PILOTE</content>
				<desc>Title for a screen that tests the pilot arc starter device.</desc>
			</text>
			<text id="229">
				<content>TELEMETRIE VITESSE</content>
				<desc>Refers to real time measurements of robot's axis velocity.</desc>
			</text>
			<text id="230">
				<content>TELEMETRIE POSITION</content>
				<desc>Refers to real time measurements of the robot's axis position.</desc>
			</text>
			<text id="231">
				<content>NB de PAS</content>
				<desc>Referring to the number of individual steps a stepper motor has traveled.</desc>
			</text>
			<text id="232">
				<content>MISE A JOUR TROUVEE</content>
				<desc>A software update has been found on a USB device.</desc>
			</text>
			<text id="233">
				<content>AUCUNE MISE A JOUR TROUVEE</content>
				<desc>No update packages have been found on a USB device.</desc>
			</text>
			<text id="234">
				<content>SELECTIONNER MODE MIG</content>
				<desc>Title for a screen to select the MIG welding mode.</desc>
			</text>
			<text id="235">
				<content>PROCEDE</content>
				<desc>Refers to a welding process.</desc>
			</text>
			<text id="236">
				<content>DIAM. DU FIL</content>
				<desc>Welding wire size.</desc>
			</text>
			<text id="237">
				<content>NUANCE FIL</content>
				<desc>Material that the given welding wire is made from.</desc>
			</text>
			<text id="238">
				<content>TYPE DE GAZ</content>
				<desc>The type of gas that is used for the given weld mode.</desc>
			</text>
			<text id="239">
				<content>SYNERGIQUE</content>
				<desc>Refers to a weld mode where the welding parameter values are calculated for the user based on the selected MIG mode.</desc>
			</text>
			<text id="240">
				<content>NON SYNERGIQUE</content>
				<desc>Refers to MIG modes where users can freely edit parameter values.</desc>
			</text>
			<text id="241">
				<content>CREER PROGRAMME</content>
				<desc>Refers to creating a new schedule (welding program).</desc>
			</text>
			<text id="242">
				<content>CREER SEQUENCE DE PROGRAMMES</content>
				<desc>Refers to creating a new chainset (collection of welding programs).</desc>
			</text>
			<text id="243">
				<content>SELECTIONNER TETE DE SOUDAGE</content>
				<desc>Refers to selecting the model of weld head (part of the robot that welds) that is connected to the system.</desc>
			</text>
			<text id="244">
				<content>VIT. A VIDE</content>
				<desc>The speed at which one of the robot's axes are positioned at.</desc>
			</text>
			<text id="245">
				<content>PLAGE</content>
				<desc>Difference between the minimum and maximum values of a parameter.</desc>
			</text>
			<text id="246">
				<content>AMORCER ARC</content>
				<desc>Refers to the process of starting an arc.</desc>
			</text>
			<text id="247">
				<content>REFERENCE EXTERNE</content>
				<desc>Refers to a calibration method where an external DC power supply is used to calibrate the power supply.</desc>
			</text>
			<text id="248">
				<content>BANC DE CHARGE</content>
				<desc>Refers to a calibration method where the power supply is connected to a machine (bank of resistors) that consumes power.</desc>
			</text>
			<text id="249">
				<content>COMPTEUR D'ENERGIE</content>
				<desc>A device that is used to measure the input power of the system.</desc>
			</text>
			<text id="250">
				<content>FERMER GRAPHIQUE</content>
				<desc>A button label to hide an overlay graph from a screen.</desc>
			</text>
			<text id="251">
				<content>USB</content>
				<desc>Refers to a USB storage device.</desc>
			</text>
			<text id="252">
				<content>ETHERNET</content>
				<desc>Referring to a protocol that transfers data over an internet connection.</desc>
			</text>
			<text id="253">
				<content>AVANT SOUDAGE</content>
				<desc>Referring to before a weld.</desc>
			</text>
			<text id="254">
				<content>APRES SOUDAGE</content>
				<desc>Referring to after a weld is complete.</desc>
			</text>
			<text id="255">
				<content>TEMPO. INT.</content>
				<desc>The period in a oscillation cycle where the oscillation axis stop after traveling the full width.</desc>
			</text>
			<text id="256">
				<content>TEMPO. EXT.</content>
				<desc>The period in a oscillation cycle where the oscillation axis stop after traveling the full width. Opposite side of the in dwell.</desc>
			</text>
			<text id="257">
				<content>CENTRER</content>
				<desc>Moving the welding torch to always be in the center of the groove.</desc>
			</text>
			<text id="258">
				<content>LARGEUR</content>
				<desc>The width of the groove in the part.</desc>
			</text>
			<text id="259">
				<content>CONNECTE</content>
				<desc>N/A</desc>
			</text>
			<text id="260">
				<content>RECHERCHE EN COURS</content>
				<desc>N/A</desc>
			</text>
			<text id="261">
				<content>ADRESSE IP</content>
				<desc>N/A</desc>
			</text>
			<text id="262">
				<content>MASQUE SUBNET</content>
				<desc>N/A</desc>
			</text>
			<text id="263">
				<content>NON SELECTIONNE</content>
				<desc>N/A</desc>
			</text>
			<text id="264">
				<content>CV</content>
				<desc>A MIG welding process. Acronym for 'Constant Voltage'.</desc>
			</text>
			<text id="265">
				<content>DIP</content>
				<desc>A MIG welding process. Short for 'Short Circuit Dip Transfer'.</desc>
			</text>
			<text id="266">
				<content>DIP2</content>
				<desc>A MIG welding process. Short for 'Short Circuit Dip Transfer'.</desc>
			</text>
			<text id="267">
				<content>AUCUN PARAMETRE</content>
				<desc>Referring to a parameter not being selected.</desc>
			</text>
			<text id="268">
				<content>NON VALIDE</content>
				<desc>Refers to a parameter not being acceptable.</desc>
			</text>
			<text id="269">
				<content>NOMBRE DE PROGRAMMES</content>
				<desc>The number of schedules (welding programs) contained in a chainset.</desc>
			</text>
			<text id="270">
				<content>DEBIT GAZ DE PROTECTION</content>
				<desc>Refers to the flow of Shield Gas used for welding.</desc>
			</text>
			<text id="271">
				<content>DEBIT REFRIGERANT</content>
				<desc>Refers to the flow of coolant that is used to cool the torch and robot.</desc>
			</text>
			<text id="272">
				<content>VPI</content>
				<desc>Acronym for 'Volts Per Inch'.</desc>
			</text>
			<text id="273">
				<content>ZERO</content>
				<desc>N/A</desc>
			</text>
			<text id="274">
				<content>BALAYER AVEC DOIGT POUR EFFACER</content>
				<desc>Prompts the user to drag their finger across an area to clear a message.</desc>
			</text>
			<text id="275">
				<content>AJOUTER UN NIVEAU DE SECURITE</content>
				<desc>Title for creating a new security level.</desc>
			</text>
			<text id="276">
				<content>NOM DU NIVEAU DE SECURITE</content>
				<desc>The name of a security level. Security levels can be assigned any name by a user.</desc>
			</text>
			<text id="277">
				<content>SIMULATEUR</content>
				<desc>N/A</desc>
			</text>
			<text id="278">
				<content>CONFIGURER</content>
				<desc>N/A</desc>
			</text>
			<text id="279">
				<content>REGLER</content>
				<desc>N/A</desc>
			</text>
			<text id="280">
				<content>COMMANDE</content>
				<desc>Telling the robot to achieve a certain result.</desc>
			</text>
			<text id="281">
				<content>REELLE</content>
				<desc>Referring to a real life measured value.</desc>
			</text>
			<text id="282">
				<content>POSITION</content>
				<desc>An error caused when a system measures a value that deviates from the commanded value.</desc>
			</text>
			<text id="283">
				<content>DEPASSEMENT</content>
				<desc>An error caused when a system misses and exceeds the intended target.</desc>
			</text>
			<text id="284">
				<content>VERSION DU PRODUIT</content>
				<desc>Version number of the complete software package.</desc>
			</text>
			<text id="285">
				<content>VERSION API</content>
				<desc>Version number for the API.</desc>
			</text>
			<text id="286">
				<content>VERSION UI</content>
				<desc>Version number of the UI application.</desc>
			</text>
			<text id="287">
				<content>OUI</content>
				<desc>N/A</desc>
			</text>
			<text id="288">
				<content>NON</content>
				<desc>N/A</desc>
			</text>
			<text id="289">
				<content>REDEMARRAGE REQUIS</content>
				<desc>The system requires a full restart.</desc>
			</text>
			<text id="290">
				<content>ERREUR BOUCLE PID</content>
				<desc>The error remaining in a PID loop.</desc>
			</text>
			<text id="291">
				<content>ECHEC DE MISE A JOUR</content>
				<desc>The system has failed to update the application.</desc>
			</text>
			<text id="292">
				<content>ECHEC DE RESTAURATION</content>
				<desc>The system has failed to restore the application.</desc>
			</text>
			<text id="293">
				<content>CONFIRMER MISE A JOUR</content>
				<desc>Prompting the user to acknowledge that they are about to update the software.</desc>
			</text>
			<text id="294">
				<content>CONFIRMER RESTAURATION</content>
				<desc>Prompting the user to acknowledge that they are about to restore the software.</desc>
			</text>
			<text id="295">
				<content>IMPORTATION DE FICHIERS</content>
				<desc>The system is currently working on importing files from a USB device.</desc>
			</text>
			<text id="296">
				<content>EXPORTATION DE FICHIERS</content>
				<desc>The system is currently working on exporting files to a USB device.</desc>
			</text>
			<text id="297">
				<content>MISE A JOUR DE L'APPLICATION</content>
				<desc>The system is currently working on updating the application.</desc>
			</text>
			<text id="298">
				<content>RESTAURATION DE L'APPLICATION</content>
				<desc>The system is currently working on restoring the application.</desc>
			</text>
			<text id="299">
				<content>SAUVEGARDE SUR USB</content>
				<desc>The system is currently working on backing up the application to a USB device.</desc>
			</text>
			<text id="300">
				<content>MODIFICATIONS PARAMETRES NON SAUVEGARDEES</content>
				<desc>Title of a message prompting the user that they have made changes to the settings that have yet to be saved.</desc>
			</text>
			<text id="301">
				<content>ENREGISTRER VALEURS PID</content>
				<desc>Title of a message prompting the user that they have made changes to the PID gains that have yet to be saved.</desc>
			</text>
			<text id="302">
				<content>AUCUNE MISE EN PAGE SELECTIONNEE</content>
				<desc>Title of a message prompting the user that they have not selected any layouts for the run screen.</desc>
			</text>
			<text id="303">
				<content>MODIFICATIONS DU PROGRAMME NON SAUVEGARDEES</content>
				<desc>Title of a message prompting the user that they have made changes to a schedule that have yet to be saved.</desc>
			</text>
			<text id="304">
				<content>MODIFICATIONS DE L'ENCHAINEMENT DE PROGRAMMES NON SAUVEGARDEES</content>
				<desc>Title of a message prompting the user that they have made changes to a chainset that have yet to be saved.</desc>
			</text>
			<text id="305">
				<content>REINITIALISER LES PARAMETRES DE L'EQUIPEMENT</content>
				<desc>Title of a message prompting the user that they about to reset the settings on a particular device.</desc>
			</text>
			<text id="306">
				<content>CONFIRMER LA SUPPRESSION</content>
				<desc>Title of a message prompting the user that they are about to delete a file.</desc>
			</text>
			<text id="307">
				<content>SUIVANT</content>
				<desc>N/A</desc>
			</text>
			<text id="308">
				<content>INTERROMPRE</content>
				<desc>Abruptly end the execution of a weld or test.</desc>
			</text>
			<text id="309">
				<content>ACCEPTER</content>
				<desc>N/A</desc>
			</text>
			<text id="310">
				<content>REJETER</content>
				<desc>N/A</desc>
			</text>
			<text id="311">
				<content>VERIFIER</content>
				<desc>To test and validate results of a calibration routine.</desc>
			</text>
			<text id="312">
				<content>REGLER LA LIMITE</content>
				<desc>N/A</desc>
			</text>
			<text id="313">
				<content>REGLER LE CENTRE</content>
				<desc>N/A</desc>
			</text>
			<text id="314">
				<content>PREMIER POINT D'ETALONNAGE</content>
				<desc>The first calibration point to be recorded in a procedure.</desc>
			</text>
			<text id="315">
				<content>DEUXIEME POINT D'ETALONNAGE</content>
				<desc>The second calibration point to be recorded in a procedure.</desc>
			</text>
			<text id="316">
				<content>EN COURS</content>
				<desc>N/A</desc>
			</text>
			<text id="317">
				<content>MESURE DU PREMIER POINT D'ETALONNAGE</content>
				<desc>The first calibration point to be measured in a procedure.</desc>
			</text>
			<text id="318">
				<content>MESURE DU DEUXIEME POINT D'ETALONNAGE</content>
				<desc>The second calibration point to be measured in a procedure.</desc>
			</text>
			<text id="319">
				<content>CONFIRMER LES RESULTATS DE L'ETALONNAGE</content>
				<desc>A title for a message that prompts the user to confirm new calibration values before saving.</desc>
			</text>
			<text id="320">
				<content>VERIFIER LES RESULTATS DE L'ETALONNAGE</content>
				<desc>A title for a screen that gives the user the option to test their new calibration results.</desc>
			</text>
			<text id="321">
				<content>RACCORDER LE GENERATEUR ET UN SHUNT AU BANC DE CHARGE</content>
				<desc>Connect the system's power supply and a device used to measure the voltage output from the power supply called a 'shunt' to another device that consumes power called a 'load bank'.</desc>
			</text>
			<text id="322">
				<content>RACCORDER UN SHUNT ETALONNE</content>
				<desc>Connect a device used to measure the voltage output from the power supply called a shunt.</desc>
			</text>
			<text id="323">
				<content>CARACTERISTIQUES DU SHUNT</content>
				<desc>The electrical characteristics of a shunt.</desc>
			</text>
			<text id="324">
				<content>RACCORDER LE GENERATEUR AU BANC DE CHARGE ET PREPARER MUTIMETRE</content>
				<desc>Connect the system's power supply to another device that consumes power called a 'load bank'.</desc>
			</text>
			<text id="325">
				<content>PREPARER TETE DE SOUDAGE</content>
				<desc>Prepare the welding robot for a weld, test or calibration.</desc>
			</text>
			<text id="326">
				<content>POSITIONNER TETE DE SOUDAGE</content>
				<desc>Position the welding robot on the part for a weld, test or calibration.</desc>
			</text>
			<text id="327">
				<content>POSITIONNER TETE DE SOUDAGE ET PREPARER MULTIMETRE</content>
				<desc>Position the welding robot on the part for calibration and prepare a meter to measure electrical characteristics.</desc>
			</text>
			<text id="328">
				<content>RACCORDER L'ALIMENTATION EXTERNE</content>
				<desc>Connect an external power supply that will be used to calibrate the systems sensors.</desc>
			</text>
			<text id="329">
				<content>AJUSTER LA TENSION POUR PREMIER POINT D'ETALONNAGE</content>
				<desc>Change the voltage to the voltage needed for the first calibration measurement.</desc>
			</text>
			<text id="330">
				<content>AJUSTER LA TENSION POUR DEUXIEME POINT D'ETALONNAGE</content>
				<desc>Change the voltage to the voltage needed for the second calibration measurement.</desc>
			</text>
			<text id="331">
				<content>APPROCHER LA PREMIERE LIMITE DE L'AXE</content>
				<desc>Position one of the weld head's axis to the desired location of its limit.</desc>
			</text>
			<text id="332">
				<content>APPROCHER LA DEUXIEME LIMITE DE L'AXE</content>
				<desc>Position one of the weld head's axis to the desired location of its limit, opposite of the first limit.</desc>
			</text>
			<text id="333">
				<content>MESURER LA DISTANCE ENTRE LES LIMITES</content>
				<desc>Prompting the user to measure the distance between the first and second limit.</desc>
			</text>
			<text id="334">
				<content>APPROCHER LE CENTRE</content>
				<desc>Prompting the user to position the axis to its physical center.</desc>
			</text>
			<text id="335">
				<content>COMMENCER RETOUR A L'ORIGINE</content>
				<desc>Prompting the user to begin one of the weld head's axis homing routine.</desc>
			</text>
			<text id="336">
				<content>RETOUR A L'ORIGINE</content>
				<desc>Notifying the user that the weld head is currently homing on of its axes.</desc>
			</text>
			<text id="337">
				<content>RETOUR A L'ORIGINE DE L'AXE</content>
				<desc>Notifying the user that the weld head is currently homing on of its axes.</desc>
			</text>
			<text id="338">
				<content>EN ATTENTE AMORCAGE</content>
				<desc>Notifying the user that the system is waiting for an arc to started before proceeding.</desc>
			</text>
			<text id="339">
				<content>EN ATTENTE DE FIN DE DEPLACEMENT DE L'AXE</content>
				<desc>Notifying the user that the system is waiting for one of the system's axes to reach its target position before proceeding.</desc>
			</text>
			<text id="340">
				<content>TEMPS MINIMUM ATTEINT</content>
				<desc>Notifying the user that the minimum time has been reached for calibrating before the user can stop the routine.</desc>
			</text>
			<text id="341">
				<content>TEMPS ECOULE</content>
				<desc>The time since a weld or test was started.</desc>
			</text>
			<text id="342">
				<content>ACCEDER AUX JOURNAUX</content>
				<desc>A permission assigned to a user allowing them access to the Logs (event log, data log, etc) area of the application.</desc>
			</text>
			<text id="343">
				<content>ACCEDER AUX PARAMETRES</content>
				<desc>A permission assigned to a user allowing them to edit their settings.</desc>
			</text>
			<text id="344">
				<content>MODIFIER PROGRAMMES</content>
				<desc>A permission assigned to a user allowing them to edit schedules saved on the system.</desc>
			</text>
			<text id="345">
				<content>REALISER DES SOUDURES</content>
				<desc>A permission assigned to a user allowing them to start a weld.</desc>
			</text>
			<text id="346">
				<content>ACCEDER A L'ETALONNAGE</content>
				<desc>A permission assigned to a user allowing them to calibrate the system.</desc>
			</text>
			<text id="347">
				<content>ACCEDER AUX VALIDATIONS</content>
				<desc>A permission assigned to a user allowing them to perform tests on the system.</desc>
			</text>
			<text id="348">
				<content>MASQUER</content>
				<desc>N/A</desc>
			</text>
			<text id="349">
				<content>AFFICHER</content>
				<desc>N/A</desc>
			</text>
			<text id="350">
				<content>PERSONNALISER</content>
				<desc>N/A</desc>
			</text>
			<text id="351">
				<content>IDENTIFIANT UTILISATEUR</content>
				<desc>A title for an event. A user has logged in to the system.</desc>
			</text>
			<text id="352">
				<content>ALARME</content>
				<desc>A title for an event. An alarm has been raised.</desc>
			</text>
			<text id="353">
				<content>TETE DE SOUDAGE CHARGEE</content>
				<desc>A title for an event. A new weld head has been attached to the system.</desc>
			</text>
			<text id="354">
				<content>PROGRAMME CHARGE</content>
				<desc>A title for an event. A new schedule (weld program) has been loaded by the user.</desc>
			</text>
			<text id="355">
				<content>PROGRAMME SAUVEGARDE</content>
				<desc>A title for an event. Changes to a schedule have been saved.</desc>
			</text>
			<text id="356">
				<content>ENCHAINMENT DES PROGRAMMES CHARGEE</content>
				<desc>A title for an event. A new chainset has been loaded by the user.</desc>
			</text>
			<text id="357">
				<content>SEQUENCE D'ENCHAINEMENT SAUVEGARDEE</content>
				<desc>A title for an event. Changes to a chainset have been saved.</desc>
			</text>
			<text id="358">
				<content>SOUDAGE COMMENCEE</content>
				<desc>A title for an event. A weld has been started by the user.</desc>
			</text>
			<text id="359">
				<content>SOUDAGE ARRETE</content>
				<desc>A title for an event. A weld has been stopped by the user.</desc>
			</text>
			<text id="360">
				<content>SOUDAGE INTERROMPU</content>
				<desc>A title for an event. A weld has been abruptly ended by the user.</desc>
			</text>
			<text id="361">
				<content>MODE DE SOUDAGE MODIFIE</content>
				<desc>A title for an event. The weld mode has been changed by the user (Example: from weld to test).</desc>
			</text>
			<text id="362">
				<content>DECONNEXION UTILISATEUR</content>
				<desc>A title for an event. A user has logged out of the system.</desc>
			</text>
			<text id="363">
				<content>SELECTIONNER PARAMETRE</content>
				<desc>Prompts the user to select a welding parameter.</desc>
			</text>
			<text id="364">
				<content>SYNCH</content>
				<desc>Short for 'Synchronous'.</desc>
			</text>
			<text id="365">
				<content>RESEAU</content>
				<desc>N/A</desc>
			</text>
			<text id="366">
				<content>TOUJOURS</content>
				<desc>N/A</desc>
			</text>
			<text id="367">
				<content>TEMPS BALAYAGE</content>
				<desc>The period of a oscillation cycle where the torch is traveling the length of the groove's width.</desc>
			</text>
			<text id="368">
				<content>TEMPO. BAL.</content>
				<desc>The period of a oscillation cycle where the torch has completed traveling the length of the groove's width and briefly pauses before traveling in the opposite direction.</desc>
			</text>
			<text id="369">
				<content>MODE ACTIF</content>
				<desc>N/A</desc>
			</text>
			<text id="370">
				<content>DUREE DU TEST</content>
				<desc>The time left to complete a system test.</desc>
			</text>
			<text id="371">
				<content>SENSIBILITE</content>
				<desc>Refers to the reactivity of one of the system's algorithms.</desc>
			</text>
			<text id="372">
				<content>PREMIER</content>
				<desc>Coming before all others in a sequence.</desc>
			</text>
			<text id="373">
				<content>SECOND</content>
				<desc>Constituting number two in a sequence.</desc>
			</text>
			<text id="374">
				<content>VITESSE ET DISTANCE</content>
				<desc>Referring to a method of calibration where both speed and distance parameters are entered by the user.</desc>
			</text>
			<text id="375">
				<content>DECONNECTE</content>
				<desc>When a device is no longer in communication with the system.</desc>
			</text>
			<text id="376">
				<content>NOTES SUR LE PROGRAMME</content>
				<desc>Notes made by a user relating to a given weld schedule.</desc>
			</text>
			<text id="377">
				<content>AJOUTER</content>
				<desc>N/A</desc>
			</text>
			<text id="378">
				<content>AUCUNE NOTE</content>
				<desc>A label telling a user that a given schedule has no associated notes.</desc>
			</text>
			<text id="379">
				<content>NOTES</content>
				<desc>N/A</desc>
			</text>
			<text id="380">
				<content>VERSION DU MICROPROGRAMME DE GESTION</content>
				<desc>The version number of the system's control firmware.</desc>
			</text>
			<text id="381">
				<content>VERSION DU MICROPROGRAMME DES CARTES D'AXE</content>
				<desc>The version number of the system's servo firmware.</desc>
			</text>
			<text id="382">
				<content>VERSION DU MICROPROGRAMME MOT. PAS-A-PAS</content>
				<desc>The version number of the system's stepper firmware.</desc>
			</text>
			<text id="383">
				<content>PETIT</content>
				<desc></desc>
			</text>
			<text id="384">
				<content>MOYEN</content>
				<desc></desc>
			</text>
			<text id="385">
				<content>GRAND</content>
				<desc></desc>
			</text>
			<text id="386">
				<content>VISUALISEUR</content>
				<desc></desc>
			</text>
			<text id="387">
				<content>GRAPHIQUE</content>
				<desc></desc>
			</text>
			<text id="388">
				<content>TELEMETRIE UNIQUEMENT</content>
				<desc></desc>
			</text>
			<text id="389">
				<content>FRACTIONNER</content>
				<desc></desc>
			</text>
			<text id="390">
				<content>FUSIONNER</content>
				<desc></desc>
			</text>
			<text id="391">
				<content>AFFICHER TOUT</content>
				<desc></desc>
			</text>
			<text id="392">
				<content>MISES EN PAGE</content>
				<desc></desc>
			</text>
			<text id="393">
				<content>RESOLUTION</content>
				<desc>The smallest interval of measurement.</desc>
			</text>
			<text id="394">
				<content>ANCIEN</content>
				<desc>N/A</desc>
			</text>
			<text id="395">
				<content>NOUVEAU</content>
				<desc>N/A</desc>
			</text>
			<text id="396">
				<content>GAIN DE LA VALEUR DE REGLAGE</content>
				<desc>The calibrated gain of a welding parameter's set point.</desc>
			</text>
			<text id="397">
				<content>OFFSET DE LA VALEUR DE REGLAGE</content>
				<desc>The calibrated offset of a welding parameter's set point.</desc>
			</text>
			<text id="398">
				<content>GAIN DE TELEMETRIE</content>
				<desc>The calibrated gain of a welding parameter's telemetry.</desc>
			</text>
			<text id="399">
				<content>OFFSET DE TELEMETRIE</content>
				<desc>The calibrated offset of a welding parameter's telemetry.</desc>
			</text>
			<text id="400">
				<content>VALEUR LIMITE POSITIVE</content>
				<desc>The maximum position an axis can move to in the positive direction.</desc>
			</text>
			<text id="401">
				<content>VALEUR LIMITE NEGATIVE</content>
				<desc>The maximum position an axis can move to in the negative direction.</desc>
			</text>
			<text id="402">
				<content>DEVELOPPEMENT</content>
				<desc>Referring to settings that are used for internal development by Liburdi engineers.</desc>
			</text>
			<text id="403">
				<content>MAXI</content>
				<desc>N/A</desc>
			</text>
			<text id="404">
				<content>MINI</content>
				<desc>N/A</desc>
			</text>
			<text id="405">
				<content>COURANT HAUT</content>
				<desc>The current set point in the primary portion of the pulsation cycle.</desc>
			</text>
			<text id="406">
				<content>COURANT BAS</content>
				<desc>The current set point in the background portion of the pulsation cycle.</desc>
			</text>
			<text id="407">
				<content>COURANT MOYEN</content>
				<desc>The average current measurement of the primary and background portions of the pulsation cycle.</desc>
			</text>
			<text id="408">
				<content>AUX0</content>
				<desc>An axis on the robot. An axis that is used for auxiliary positioning.</desc>
			</text>
			<text id="409">
				<content>AUX1</content>
				<desc>An axis on the robot. An axis that is used for auxiliary positioning.</desc>
			</text>
			<text id="410">
				<content>AUX2</content>
				<desc>An axis on the robot. An axis that is used for auxiliary positioning.</desc>
			</text>
			<text id="411">
				<content>AUX3</content>
				<desc>An axis on the robot. An axis that is used for auxiliary positioning.</desc>
			</text>
			<text id="412">
				<content>AUX4</content>
				<desc>An axis on the robot. An axis that is used for auxiliary positioning.</desc>
			</text>
			<text id="413">
				<content>AUX5</content>
				<desc>An axis on the robot. An axis that is used for auxiliary positioning.</desc>
			</text>
			<text id="414">
				<content>AUX6</content>
				<desc>An axis on the robot. An axis that is used for auxiliary positioning.</desc>
			</text>
			<text id="415">
				<content>AUX7</content>
				<desc>An axis on the robot. An axis that is used for auxiliary positioning.</desc>
			</text>
			<text id="416">
				<content>AUX8</content>
				<desc>An axis on the robot. An axis that is used for auxiliary positioning.</desc>
			</text>
			<text id="417">
				<content>AUX9</content>
				<desc>An axis on the robot. An axis that is used for auxiliary positioning.</desc>
			</text>
			<text id="418">
				<content>DATE ET HEURE</content>
				<desc>Title label for a settings screen that displays date and time.</desc>
			</text>
			<text id="419">
				<content>DATE</content>
				<desc>Title label date settings.</desc>
			</text>
			<text id="420">
				<content>AM</content>
				<desc>Abbreviation for morning.</desc>
			</text>
			<text id="421">
				<content>PM</content>
				<desc>Abbreviation for afternoon.</desc>
			</text>
			<text id="422">
				<content>SUPPRIMER</content>
				<desc>Eliminate, delete or get rid of.</desc>
			</text>
			<text id="423">
				<content>HAUTEUR CHANFREIN</content>
				<desc>The height measurement in which the groove's width should be measured at.</desc>
			</text>
			<text id="424">
				<content>DESCRIPTIONS</content>
				<desc>A sentence or paragraph that describes a parameter.</desc>
			</text>
			<text id="425">
				<content>DIAMETRE</content>
				<desc>The length measurement of the width of a circle.</desc>
			</text>
			<text id="426">
				<content>PROFONDEUR CHANFREIN</content>
				<desc>The height measurement of a groove in the part to be welded.</desc>
			</text>
			<text id="427">
				<content>ORIENTATION</content>
				<desc>The position of the torch relative to the part to be welded.</desc>
			</text>
			<text id="428">
				<content>MESURER LA LARGEUR DU CHANFREIN</content>
				<desc>A label prompting the user to take a length measurement of the part's groove width.</desc>
			</text>
			<text id="429">
				<content>LARGEUR MESUREE</content>
				<desc>The length measurement of the part's groove width.</desc>
			</text>
			<text id="430">
				<content>MESURER A LA HAUTEUR DE:</content>
				<desc>The height measurement in which the groove's width should be measured at.</desc>
			</text>
			<text id="431">
				<content>MESURER LA LARGEUR</content>
				<desc>A label prompting the user to take a length measurement of the part's groove width.</desc>
			</text>
			<text id="432">
				<content>GESTIONNAIRE DE FICHIERS</content>
				<desc>A utility that assists users in selecting, deleting, renaming and managing their files.</desc>
			</text>
			<text id="433">
				<content>SELECTION AUTOMATIQUE DE PROGRAMME</content>
				<desc>Automatic schedule selection is a feature where the robot will automatically select a schedule for the operator to use based on a number of input parameters and measurements.</desc>
			</text>
			<text id="434">
				<content>MESURE DE LA LARGEUR DU CHANFREIN EN COURS</content>
				<desc>A prompt that the system is currently measuring the width of the groove.</desc>
			</text>
			<text id="435">
				<content>AUTOMATISATION</content>
				<desc>Refers to the system automatically performing certain actions that can be tedious or slow.</desc>
			</text>
			<text id="436">
				<content>MIG AVANCE</content>
				<desc>A subset of welding parameters that provide a deeper level of control over a MIG weld.</desc>
			</text>
			<text id="437">
				<content>EXECUTER LA SELECTION AUTOMATIQUE DE PROGRAMME</content>
				<desc>Refers to the robot attempting to select a schedule. Automatic schedule selection is a feature where the robot will automatically select a schedule for the operator to use based on a number of input parameters and measurements.</desc>
			</text>
			<text id="438">
				<content>ID EN DOUBLE</content>
				<desc>Refers to a file ID occurring on the system more than once.</desc>
			</text>
			<text id="439">
				<content>ID MANQUANT</content>
				<desc>Refers to a file that does not have an ID associated.</desc>
			</text>
			<text id="440">
				<content>ID SUGGERE</content>
				<desc>Refers to an ID that is free to be used by a file that does not yet have one.</desc>
			</text>
			<text id="441">
				<content>CONFLIT</content>
				<desc>A file that contains invalid data or has an invalid name.</desc>
			</text>
			<text id="442">
				<content>CONFLITS DE FICHIER</content>
				<desc>A file that contains invalid data or has an invalid name.</desc>
			</text>
			<text id="443">
				<content>IGNORER</content>
				<desc>An act of passing over part of a sequence of data or instructions</desc>
			</text>
			<text id="444">
				<content>ECRASER</content>
				<desc>Destroy or lose (data) by entering new data in its place</desc>
			</text>
			<text id="445">
				<content>IGNORER TOUT</content>
				<desc>Skip all conflicts for a particular set of files.</desc>
			</text>
			<text id="446">
				<content>SUPPRIMER TOUT</content>
				<desc>Delete all conflicts for a particular set of files.</desc>
			</text>
			<text id="447">
				<content>ACCEPTER TOUT</content>
				<desc>Accept all conflicts for a particular set of files.</desc>
			</text>
			<text id="448">
				<content>NOMBRE DE CONFLITS</content>
				<desc>The number or count of system files that contain a conflict.</desc>
			</text>
			<text id="449">
				<content>EXISTANT</content>
				<desc>Refers to something that is currently in place.</desc>
			</text>
			<text id="450">
				<content>PASSE</content>
				<desc>Refers to one complete rotation around a pipe that is being welded.</desc>
			</text>
			<text id="451">
				<content>SUIVI</content>
				<desc>Refers to following a profile or groove of a part that is being welded.</desc>
			</text>
			<text id="452">
				<content>LINCOLN POWERWAVE</content>
				<desc>NOT TO BE TRANSLATED</desc>
			</text>
			<text id="453">
				<content>POSTE DE SOUDAGE LINCOLN</content>
				<desc>The weld set identifier of a Lincoln power supply.</desc>
			</text>
			<text id="454">
				<content>LOCALISATION</content>
				<desc>Refers to translating a product into different languages or adapting a product to a country or region.</desc>
			</text>
			<text id="455">
				<content>INFOS SYSTEME</content>
				<desc>Refers to a group of information that pertains to the particular system.</desc>
			</text>
			<text id="456">
				<content>RETOUR AUTOMATIQUE A L'ORIGINE</content>
				<desc>Refers to automatic weld head homing. Before or after a weld, the robot's weld head will go back to it's home position.</desc>
			</text>
			<text id="457">
				<content>NON PRECISE</content>
				<desc>Meaning not stated clearly or exactly</desc>
			</text>
			<text id="458">
				<content>CONTENU DU FICHIER NON VALIDE</content>
				<desc>The content of the file is invalid and can not be loaded.</desc>
			</text>
			<text id="459">
				<content>DYNAMICS</content>
				<desc>DO NOT TRANSLATE</desc>
			</text>
			<text id="460">
				<content>SELECTIONNER TETES DE SOUDAGE ACTIVES</content>
				<desc>Select weld heads that will be visible to operators.</desc>
			</text>
			<text id="461">
				<content>DEBIT GAZ DE TUYERE</content>
				<desc>Refers to the flow of Plasma Gas used for welding.</desc>
			</text>
			<text id="462">
				<content>DEBIT GAZ DE TRAINARD</content>
				<desc>Refers to the flow of Trail Gas used for welding.</desc>
			</text>
			<text id="463">
				<content>PROGRAMME ACTUEL</content>
				<desc>Refers to the schedule that is currently loaded.</desc>
			</text>
			<text id="464">
				<content>BOUCLE</content>
				<desc>Refers to a loop index.</desc>
			</text>
			<text id="465">
				<content>SELECTIONNER TOUT</content>
				<desc>Refers to selecting all items in a list.</desc>
			</text>
			<text id="466">
				<content>DESELECTIONNER TOUT</content>
				<desc>Refers to unselecting all items in a list.</desc>
			</text>
			<text id="467">
				<content>TELEMETRIE COURANT</content>
				<desc>Refers to a measured current value.</desc>
			</text>
			<text id="468">
				<content>DEBIT GAZ</content>
				<desc>Refers to the setpoints of gas flow rate parameters.</desc>
			</text>
			<text id="469">
				<content>FORMAT GRYPHON</content>
				<desc>Refers to a file format supported by the previous generation welding controller called Gryphon.</desc>
			</text>
			<text id="470">
				<content>POSER</content>
				<desc>Refers to presenting a message to the UI.</desc>
			</text>
			<text id="471">
				<content>QUESTION</content>
				<desc>A sentence worded or expressed so as to elicit information.</desc>
			</text>
			<text id="472">
				<content>CONFIRMATION</content>
				<desc>A message that is confirming something.</desc>
			</text>
			<text id="473">
				<content>NOTIFICATION</content>
				<desc>A message that notifies the user of something.</desc>
			</text>
			<text id="474">
				<content>ARU</content>
				<desc>Short for 'emergency stop'.</desc>
			</text>
			<text id="475">
				<content>OVERRIDE LIMIT</content>
				<desc>Refers to unselecting all items in a list.</desc>
			</text>
			<text id="476">
				<content>DEFAUT CRITIQUE</content>
				<desc>Refers to unselecting all items in a list.</desc>
			</text>
			<text id="477">
				<content>BLOCQUER NONE</content>
				<desc>Refers to an alarm message that does not block any UI.</desc>
			</text>
			<text id="478">
				<content>BLOCQUER UI</content>
				<desc>Refers to an alarm message that block the system's UI.</desc>
			</text>
			<text id="479">
				<content>BLOCQUER TOUT</content>
				<desc>Refers to an alarm message that block the system's UI and all connected devices.</desc>
			</text>
			<text id="480">
				<content>CRITIQUE</content>
				<desc>Refers to a critical alarm message.</desc>
			</text>
			<text id="481">
				<content>LISTE</content>
				<desc>A number of connected items or names grouped together.</desc>
			</text>
			<text id="482">
				<content>REMARQUES</content>
				<desc>Documents released with software builds that take note of key changes made to the product since the last release.</desc>
			</text>
			<text id="483">
				<content>TELECHARGEMENT</content>
				<desc>Pulling data from a remote location.</desc>
			</text>
			<text id="484">
				<content>CREATING RESTORE POINT</content>
				<desc>Refers to creating a backup before installing an update.</desc>
			</text>
			<text id="485">
				<content>INSTALLING</content>
				<desc>To install or upgrade a software component on a system.</desc>
			</text>
			<text id="486">
				<content>INSTALLED UPDATE</content>
				<desc>The software build that was installed on the system.</desc>
			</text>
			<text id="487">
				<content>FAILED TO INSTALL UPDATE</content>
				<desc>An error occurred while upgrading the system's software.</desc>
			</text>
			<text id="488">
				<content>UI</content>
				<desc>An acronym for user interface. Means the graphical/ visual component of the software.</desc>
			</text>
			<text id="489">
				<content>CONTROL BOARD</content>
				<desc>Refers to the main control circuit board that runs the system's firmware.</desc>
			</text>
			<text id="490">
				<content>CARTE D'AXE</content>
				<desc>Refers to the circuit board that controls the system's servo motors.</desc>
			</text>
			<text id="491">
				<content>CARTE PAS-A-PAS</content>
				<desc>Refers to the circuit board that controls the system's stepper motors.</desc>
			</text>
			<text id="492">
				<content>NO UPDATES AVAILABLE</content>
				<desc>The system could not find any update packages that were compatible.</desc>
			</text>
			<text id="493">
				<content>CHECKING FOR UPDATES</content>
				<desc>The system is looking for compatible updates.</desc>
			</text>
			<text id="494">
				<content>OTA</content>
				<desc>Acronym for Over-the-Air. Refers to software updates that are downloaded from a remote server.</desc>
			</text>
			<text id="495">
				<content>SAUVEGARDER LOGICIEL</content>
				<desc>Refers to a full backup or copy of the system's software package that can be restored to in case an upgrade goes wrong.</desc>
			</text>
			<text id="496">
				<content>SAUVEGARDER</content>
				<desc>Refers to a user prompt to initiate the process of creating a software backup.</desc>
			</text>
			<text id="497">
				<content>SAUVEGARDER VERS SERVER</content>
				<desc>Perform a software backup to be sent to a remote server.</desc>
			</text>
			<text id="498">
				<content>SAUVEGARDE EN COURS</content>
				<desc>The software is being copied or backed up to a remote server.</desc>
			</text>
			<text id="499">
				<content>SAUVEGARDE TERMINEE</content>
				<desc>The software backup is complete.</desc>
			</text>
			<text id="500">
				<content>CREATE KEY</content>
				<desc>Refers creating a digital USB security key.</desc>
			</text>
			<text id="501">
				<content>FIRE CONNECT</content>
				<desc>Refers to the name of the data link unique to Liburdi Products.</desc>
			</text>
			<text id="502">
				<content>FireView</content>
				<desc>Refers to the name of the vision system unique to Liburdi Products.</desc>
			</text>
			<text id="503">
				<content>MQTT</content>
				<desc>Refers to the name of a standard telemetry protocol. Stands for Message Query Telemetry Transport.</desc>
			</text>
			<text id="504">
				<content>CHECK FOR UPDATES</content>
				<desc>A button title that lets the user begin looking for available updates.</desc>
			</text>
			<text id="505">
				<content>NTP</content>
				<desc>Refers to a web standard. Stands for Network Time Protocol.</desc>
			</text>
			<text id="506">
				<content>APPORT DE CAHALEUR</content>
				<desc>Refers to the measured heat input.</desc>
			</text>
			<text id="507">
				<content>AVC VERROUILLE</content>
				<desc>Refers to a mode of operation of the 'Automatic Voltage Control' algorithm where the controller does not move the AVC axis.</desc>
			</text>
			<text id="508">
				<content>AVC ECHANTILLONNE</content>
				<desc>Refers to a mode of operation of the 'Automatic Voltage Control' algorithm where the controller only moves the AVC axis in either the primary or background portion of the cycle.</desc>
			</text>
			<text id="509">
				<content>AVC CONTINUE</content>
				<desc>Refers to a mode of operation of the 'Automatic Voltage Control' algorithm where the controller moves the AVC axis in both the primary or background portions of the cycle.</desc>
			</text>
			<text id="510">
				<content>DERNIERE SUVEGARDE</content>
				<desc>Refers to the time of when the last restore point was created.</desc>
			</text>
			<text id="511">
				<content>TRIM</content>
				<desc>A schedule parameter for the DIP process.</desc>
			</text>
			<text id="512">
				<content>FICHIER</content>
				<desc>A computer resource for recording data in a computer storage device.</desc>
			</text>
			<text id="513">
				<content>MEMOIRE</content>
				<desc>Location where data is temporarily stored on a computer for later use.</desc>
			</text>
			<text id="514">
				<content>ID</content>
				<desc>Short for identifier.</desc>
			</text>
			<text id="515">
				<content>GAZ DE PROTECTION</content>
				<desc>Refers to the Shield Gas used for welding.</desc>
			</text>
			<text id="516">
				<content>GAZ TRAINARD</content>
				<desc>Refers to the Trail Gas used for welding.</desc>
			</text>
			<text id="517">
				<content>GAZ DE TUYERE</content>
				<desc>Refers to the Plasma Gas used for welding.</desc>
			</text>
			<text id="518">
				<content>GAZ ENVERS</content>
				<desc>Refers to the Backup Gas used for welding.</desc>
			</text>
			<text id="519">
				<content>ADJUST GAS FLOW TO FIRST CALIBRATION POINT</content>
				<desc>Change the gas flow to the flow needed for the first calibration measurement.</desc>
			</text>
			<text id="520">
				<content>ADJUST GAS FLOW TO SECOND CALIBRATION POINT</content>
				<desc>Change the gas flow to the flow needed for the second calibration measurement.</desc>
			</text>
			<text id="521">
				<content>WIRE MANIPULATOR IN/OUT</content>
				<desc>An axis on the robot. The axis that positions wire feeder while welding.</desc>
			</text>
			<text id="522">
				<content>WIRE MANIPULATOR UP/DOWN</content>
				<desc>An axis on the robot. The axis that positions wire feeder while welding.</desc>
			</text>
			<text id="523">
				<content>ROTATING TUNGSTEN</content>
				<desc>An axis on the robot. The axis that positions the tungsten and can oscillate.</desc>
			</text>
			<text id="524">
				<content>AVC IDLE</content>
				<desc>Refers to a mode of operation of the 'Automatic Voltage Control' algorithm where the controller does put the AVC axis in sequence.</desc>
			</text>
			<text id="525">
				<content>WAITING FOR GAS TO FLOW</content>
				<desc>Notifying the user that the system is waiting for gas to start flowing at the specified flow rate.</desc>
			</text>
			<text id="526">
				<content>TRACK DIAMETER</content>
				<desc>Refers to the calculated value of track diameter.</desc>
			</text>
			<text id="527">
				<content>CALIBRATED</content>
				<desc>N/A.</desc>
			</text>
			<text id="528">
				<content>FLAT TRACK</content>
				<desc>Refers to the flat shape of the track that a robot is attached to.</desc>
			</text>
			<text id="529">
				<content>ROTARY TRACK</content>
				<desc>Refers to the orbital shape of the track that a robot is attached to.</desc>
			</text>
			<text id="530">
				<content>PREPARE THE TRACK</content>
				<desc>A title for a message that propmts the user to prepare the track of a robot for calibration.</desc>
			</text>
			<text id="531">
				<content>CALIBRATE ROTARY TRACK</content>
				<desc>A title for a message that propmts the user to perform an action for calibration of a robot.</desc>
			</text>
			<text id="532">
				<content>TIG</content>
				<desc>A type of welding process. Acronym for 'Tungsten Inert Gas' welding. Also known as GTAW welding.</desc>
			</text>

			<!--Descriptions-->
			<text id="65536">
				<content>Connectez-vous à un ordinateur à l'aide de l'un des ports Ethernet du système. Configurez le sous-réseau ci-dessous puis effectuez un test Ping de l'adresse IP du système pour tester la connexion.</content>
				<desc>Description of how to perform a test of the systems networking hardware.</desc>
			</text>
			<text id="65537">
				<content>Insérez une clé USB et vérifiez le code de statut pour tester la connexion.</content>
				<desc>Description of how to perform a test of the systems USB hardware. Test by simply plugging in a USB device which will show an indicator on the screen.</desc>
			</text>
			<text id="65538">
				<content>Les paramètres utilisateurs individuels seront appliqués.</content>
				<desc>Description of one of the 'General Settings Management' modes.</desc>
			</text>
			<text id="65539">
				<content>Les paramètres utilisateurs individuels seront appliqués pour les utilisateurs qui disposent des droits d'accès aux paramètres. Sinon, les paramètres ADMIN seront appliqués.</content>
				<desc>Description of one of the 'General Settings Management' modes. This mode forces the user to inherit settings from the administrative account if they do not have the permission.</desc>
			</text>
			<text id="65540">
				<content>Les paramètres ADMIN seront appliqués à tous les utilisateurs.</content>
				<desc>Description of one of the 'General Settings Management' modes. This mode forces all users to inherit settings from the administrative account.</desc>
			</text>
			<text id="65541">
				<content>Validez les résultats de l'étalonnage avant de les enregistrer.</content>
				<desc>Message text to prompt the user to confirm that the calibration values are correct before saving them.</desc>
			</text>
			<text id="65542">
				<content>L'étalonnage est en cours...</content>
				<desc>Message text to notify that the user that calibration is in progress.</desc>
			</text>
			<text id="65543">
				<content>Sélectionnez VERIFIER pour accéder à l'écran de test %1. Sélectionnez QUITTER pour revenir au menu d'étalonnage.</content>
				<desc>%1 = name of the screen to be navigated to. Message text to notifying the user of the next steps after finishing a calibration routine.</desc>
			</text>
			<text id="65544">
				<content>Entrez la valeur de réglage %1 du point d'étalonnage %2. La valeur recommandée est %3% du paramètre %4 maximum.</content>
				<desc>%1 = parameter to calibrate. %2 = FIRST or SECOND calibration point. %3 = recommended max percentage of the parameter. %4 = parameter to calibrate. Message text to prompt the user to enter the desired set point value for the first calibration point.</desc>
			</text>
			<text id="65545">
				<content>Entrez le courant shunt mesuré et la tension (mV) dans les champs de saisie ci-dessus.</content>
				<desc>Message text to prompt the user to enter in the shunt's electrical characteristics before starting the calibration routine.</desc>
			</text>
			<text id="65546">
				<content>A l'aide d'un multimètre, mesurez la tension (mV) sur le shunt et saisissez-la dans le champ de saisie ci-dessus.</content>
				<desc>Message text prompting the user to use a multimeter to enter the voltage measured across the shunt. This is a step of a calibration procedure.</desc>
			</text>
			<text id="65547">
				<content>A l'aide d'un multimètre, mesurez la tension entre l'électrode et la pièce et saisissez-la dans le champ de saisie ci-dessus.</content>
				<desc>Message text prompting the user to measure the voltage between the weld head's torch and the work piece using a multimeter. This is a step of a calibration procedure.</desc>
			</text>
			<text id="65548">
				<content>Connecter l'alimentation stabilisée à l'électrode et à la pièce.</content>
				<desc>Message text prompting the user to connect an external power supply to the system for use in a calibration procedure.</desc>
			</text>
			<text id="65549">
				<content>Réglez la tension de l'alimentation stabilisée sur 20 % de la valeur de tension maximum.</content>
				<desc>Message text prompting the user to adjust the external power supply's output to be 20% of the system's maximum voltage. This is a step of a calibration procedure.</desc>
			</text>
			<text id="65550">
				<content>Augmentez la tension entre l'électrode et la pièce d'un minimum de 5 volts.</content>
				<desc>Message text prompting the user to adjust the external power supply's output by at least 5 volts. This is a step of a calibration procedure.</desc>
			</text>
			<text id="65551">
				<content>Le banc de charge doit être correctement réglé pour obtenir une tension appropriée.</content>
				<desc>A prompt for the user to adjust their load bank settings to achieve a suitable initial voltage. This is preparation for a calibration procedure.</desc>
			</text>
			<text id="65552">
				<content>Avant de continuer, brancher un shunt étalonné au câble de masse.</content>
				<desc>A prompt for the user to connect a resistive shunt which is a tool used in a calibration procedure. This is preparation for a calibration procedure.</desc>
			</text>
			<text id="65553">
				<content>Le générateur peut indiquer que l'amorçage a échoué si la tension initiale est trop élevée ou trop faible.</content>
				<desc>A prompt for the user to adjust their load bank settings to achieve a suitable initial voltage. This is preparation for a calibration procedure.</desc>
			</text>
			<text id="65554">
				<content>Utilisez un multimètre pour mesurer le courant, mais ne le brancher pas avant d'avoir allumé le générateur.</content>
				<desc>A prompt for the user to prepare a multimeter measurement device to be used in a calibration procedure.</desc>
			</text>
			<text id="65555">
				<content>Déplacer la tete de soudage jusqu'à la position souhaitée pour commencer l'étalonnage.</content>
				<desc>Jog or move the weld head to the desired position. This is preparation for a calibration procedure.</desc>
			</text>
			<text id="65556">
				<content>Soyez prudent, le générateur s'allume lorsque vous appuyez sur START.</content>
				<desc>A warning to the user that pressing start will enable the power supply. This is part of a step of a calibration procedure.</desc>
			</text>
			<text id="65557">
				<content>Mesurez %1 et entrez la valeur dans le champ de saisie ci-dessus.</content>
				<desc>%1 = parameter being calibrated. Message text prompting the user to physically measure the distance traveled by the axis during calibration.</desc>
			</text>
			<text id="65558">
				<content>Mesurez la distance entre les nouvelles valeurs limites et entrez la valeur dans le champ de saisie ci-dessus.</content>
				<desc>Message text prompting the user to physically measure the distance between the two limits previously set. This is a step of a calibration procedure.</desc>
			</text>
			<text id="65559">
				<content>Préparez la tête de soudage et la zone de travail avant déplacer l'axe jusqu'à la limite souhaitée.</content>
				<desc>Message text prompting the user to prepare the weld head and work space to calibrate its limits. Limit calibration requires the head to be physically positioned to both sides of its limits.</desc>
			</text>
			<text id="65560">
				<content>Déplacer l'axe sélectionné jusqu'à sa limite %1.</content>
				<desc>%1 = FIRST or SECOND limit. Message text prompting the user to position the axis to record its first limit. This is a step of a calibration procedure.</desc>
			</text>
			<text id="65561">
				<content>Faites bouger l'axe sélectionné jusqu'à la position centrale (zéro).</content>
				<desc>Message text prompting the user to position the weld head's axis in the center of the two previously set limits. This is a step of a calibration procedure.</desc>
			</text>
			<text id="65562">
				<content>Cliquez sur SUIVANT pour commencer le retour à l'origine de la tête de soudage.</content>
				<desc>Message text notifying the user that clicking next will begin moving the axis. Will begin a homing routine. This is a step of a calibration procedure.</desc>
			</text>
			<text id="65563">
				<content>Retour de la tête de soudage à sa position d'origine...</content>
				<desc>Message text notifying the user that the homing routine is in progress. This is a step of a calibration procedure.</desc>
			</text>
			<text id="65564">
				<content>Amor. contact : vérification</content>
				<desc>Description of a step in a welding procedure. Checking if the torch is touching the workpiece.</desc>
			</text>
			<text id="65565">
				<content>Amor. contact : actif</content>
				<desc>Description of a step in a welding procedure.</desc>
			</text>
			<text id="65566">
				<content>Amorçage de l'arc : Haute fréquence</content>
				<desc>Description of a step in a welding procedure. Starting a high frequency arc.</desc>
			</text>
			<text id="65567">
				<content>Amorçage de l'arc : MIG</content>
				<desc>Description of a step in a welding procedure. Starting a MIG arc.</desc>
			</text>
			<text id="65568">
				<content>Amorçage de l'arc : Metal Beam</content>
				<desc>Description of a step in a welding procedure. Starting a Metal Beam arc.</desc>
			</text>
			<text id="65569">
				<content>Amorçage de l'arc : Plasma</content>
				<desc>Description of a step in a welding procedure. Starting a plasma arc.</desc>
			</text>
			<text id="65570">
				<content>Amorçage de l'arc : Lift Arc</content>
				<desc>Description of a step in a welding procedure. Starting a scratch arc.</desc>
			</text>
			<text id="65571">
				<content>Arrêt de l'arc</content>
				<desc>Description of a step in a welding procedure. Stopping hte arc.</desc>
			</text>
			<text id="65572">
				<content>Pre Positionnement</content>
				<desc>Description of a step in a welding procedure. Positioning an axis before the weld starts.</desc>
			</text>
			<text id="65573">
				<content>Post Positionnement</content>
				<desc>Description of a step in a welding procedure. Positioning an axis after a weld ends.</desc>
			</text>
			<text id="65574">
				<content>Nettoyer</content>
				<desc>Description of a step in a welding procedure. Finalizing the states of the welder after a weld.</desc>
			</text>
			<text id="65575">
				<content>Acquisition : démarrer</content>
				<desc>Description of a step in a welding procedure.</desc>
			</text>
			<text id="65576">
				<content>Acquisition : arrêter</content>
				<desc>Description of a step in a welding procedure.</desc>
			</text>
			<text id="65577">
				<content>Mesure de la largeur du chanfrein</content>
				<desc>Description of a step in a welding procedure. Measuring the width of a groove in order to select a schedule.</desc>
			</text>
			<text id="65578">
				<content>Retour à l'origine</content>
				<desc>Description of a step in a welding procedure.</desc>
			</text>
			<text id="65579">
				<content>Gaz avant</content>
				<desc>Description of a step in a welding procedure.</desc>
			</text>
			<text id="65580">
				<content>Gaz après</content>
				<desc>Description of a step in a welding procedure.</desc>
			</text>
			<text id="65581">
				<content>Suivi de joint : démarrer</content>
				<desc>Description of a step in a welding procedure. Starting the seamtracking algorithm.</desc>
			</text>
			<text id="65582">
				<content>Suivi de joint : arrêter</content>
				<desc>Description of a step in a welding procedure. Stopping the seamtracking algorithm.</desc>
			</text>
			<text id="65583">
				<content>Sélectionner programme</content>
				<desc>Description of a step in a welding procedure. Automatically selecting a schedule based on the characteristics of the groove.</desc>
			</text>
			<text id="65584">
				<content>Configuration</content>
				<desc>Description of a step in a welding procedure. Setting up states in the welder before a weld.</desc>
			</text>
			<text id="65585">
				<content>Minuteur</content>
				<desc>Description of a step in a welding procedure.</desc>
			</text>
			<text id="65586">
				<content>Mise à jour des paramètres : MIG</content>
				<desc>Description of a step in a welding procedure. Updating the welder with new parameters for a segment in the weld schedule.</desc>
			</text>
			<text id="65587">
				<content>Mise à jour des paramètres : TIG</content>
				<desc>Description of a step in a welding procedure. Updating the welder with new parameters for a segment in the weld schedule.</desc>
			</text>
			<text id="65588">
				<content>Position zéro</content>
				<desc>Description of a step in a welding procedure.</desc>
			</text>
			<text id="65589">
				<content>Mise à jour des paramètres : évanouissement</content>
				<desc>Description of a step in a welding procedure.</desc>
			</text>
			<text id="65590">
				<content>Contact AVC</content>
				<desc>Description of a step in a welding procedure. Touching the torch to the work piece.</desc>
			</text>
			<text id="65591">
				<content>Ensure the above gas is connected to the %1 line. If you want to calibrate with a different gas, abort and select a new gas from the settings screen.</content>
				<desc>%1 = type of gas being calibrated.</desc>
			</text>
			<text id="65592">
				<content>Set the amount of gas flowing to be about 20% of the maximum value.</content>
				<desc>Message text prompting the user to adjust the gas flow output to be 20% of the system's maximum voltage. This is a step of a calibration procedure.</desc>
			</text>
			<text id="65593">
				<content>Increase the amount of gas flowing before continuing.</content>
				<desc>Message text prompting the user to increase the amount of gas flowing. This is a step of a calibration procedure.</desc>
			</text>
			<text id="65594">
				<content>Using a flow meter, measure the gas flow and enter it in the input field above.</content>
				<desc>Message text prompting the user to measure the gas flow using a flow meter. This is a step of a calibration procedure.</desc>
			</text>
			<text id="65595">
				<content>There is no need to calibrate a flat track.</content>
				<desc>Description of a step in a welding procedure.</desc>
			</text>
			<text id="65596">
				<content>Mark the current position of the weldhead on the track.</content>
				<desc>Description of a step in a welding procedure. Mark the track where the </desc>
			</text>
			<text id="65597">
				<content>Jog the weldhead until is has completed a full rotation around the track and returned to the previously marked position. Press NEXT once completed.</content>
				<desc>Description of a step in a welding procedure. Rotate the weldhead 360 degrees.</desc>
			</text>
			<!--Messages-->
			<text id="1048576">
				<content>Aucun programme n'a été chargé. Voulez-vous créer ou charger un programme ?</content>
				<desc>Message text prompting the user to load a schedule (weld program) before navigating into the weld area.</desc>
			</text>
			<text id="1048577">
				<content>Le système ne possède pas de paramètre pouvant être étalonné.</content>
				<desc>Message text notifying the user that there is no components of the system that can be calibrated.</desc>
			</text>
			<text id="1048578">
				<content>Les unités de mesure ont changé. Voulez-vous rendre ces modifications permanentes ?</content>
				<desc>Message text asking the user to save changes made to the user units.</desc>
			</text>
			<text id="1048579">
				<content>Certaines modifications apportées aux paramètres nécessitent un redémarrage du système. Eteignez le système.</content>
				<desc>Message text notifying the user that changes that were made to the system require a full restart to go into effect. The user must power down the system to continue.</desc>
			</text>
			<text id="1048580">
				<content>Tous les fichiers qui portent le même nom qu'un fichier importé sera écrasé. Voulez-vous importer les fichiers ?</content>
				<desc>Message text prompting the user to confirm importing files. If there is any file already on the system with the same name as a file that is being imported, the file will be overwritten.</desc>
			</text>
			<text id="1048581">
				<content>Voulez-vous supprimer les fichiers après exportation ?</content>
				<desc>Message text asking the user if they would like to delete the files from the system after they have been exported to a USB device.</desc>
			</text>
			<text id="1048582">
				<content>La mise à jour a échoué. Consultez les journaux de suivi pour en savoir plus.</content>
				<desc>Message text notifying the user that there was a error while attempting to perform an update. The user must view the trace logs to gain additional details as to why the update failed.</desc>
			</text>
			<text id="1048583">
				<content>La restauration a échoué. Consultez les journaux de suivi pour en savoir plus.</content>
				<desc>Message text notifying the user that there was a error while attempting to perform a restore. The user must view the trace logs to gain additional details as to why the restore operation failed.</desc>
			</text>
			<text id="1048584">
				<content>Une mise à jour entraînera des modifications du fonctionnement du système. Voulez-vous exécuter la mise à jour ?</content>
				<desc>Message text prompting the user to confirm updating the application.</desc>
			</text>
			<text id="1048585">
				<!--TO BE TRANSLATED-->
				<content>Restoring from a backup will delete all user data that has been created since the last time the system was backed up, which was %1. Schedules, data logs and settings may be permanently lost. Do you want to proceed with the restore?</content>
				<desc>Message text warning the user that all files currently on the system will be overwritten and prompting the user to confirm restoring the application.</desc>
			</text>
			<text id="1048586">
				<content>Voulez-vous supprimer cet utilisateur %1 du système ?</content>
				<desc>%1 = User Name. Message text prompting the user to confirm deleting a user from the system.</desc>
			</text>
			<text id="1048587">
				<content>Les paramètres système ont été modifiés. Voulez-vous rendre ces modifications permanentes ?</content>
				<desc>Message text prompting the user to confirm saving changes made to the system settings.</desc>
			</text>
			<text id="1048588">
				<content>Selected logs have been written to the current trace log file.</content>
				<desc>Message text notifying the user that the selected logs have been written to the trace log file.</desc>
			</text>
			<text id="1048589">
				<content>Please be advised, writing to the trace log file can take several minutes to complete.</content>
				<desc>Message text asking user which type of logs to write to the trace log file.</desc>
			</text>
			<text id="1048590">
				<content>Les valeurs PID ont été modifiées. Voulez-vous rendre ces modifications permanentes ?</content>
				<desc>Message text asking the user to save changes made to the PID values.</desc>
			</text>
			<text id="1048591">
				<content>Les paramètres de sécurité utilisateur ont été modifiés. Voulez-vous rendre ces modifications permanentes ?</content>
				<desc>Message text asking the user to save changes made to the security settings.</desc>
			</text>
			<text id="1048592">
				<content>Des modifications ont été apportées au programme. Voulez-vous rendre ces modifications permanentes ?</content>
				<desc>Message text asking the user to save changes made to the schedule (weld program).</desc>
			</text>
			<text id="1048593">
				<content>Des modifications ont été apportées à la séquence de programmes. Voulez-vous rendre ces modifications permanentes ?</content>
				<desc>Message text asking the user to save changes made to the chainset.</desc>
			</text>
			<text id="1048594">
				<content>Une réinitialisation de l'étalonnage entraînera des modifications du fonctionnement du système. Voulez-vous exécuter la réinitialisation ?</content>
				<desc>Message text prompting the user to confirm resetting the calibration values back to their default states.</desc>
			</text>
			<text id="1048595">
				<content>Une réinitialisation de l'équipement supprimera tous les journaux enregistrés. Voulez-vous exécuter la réinitialisation ?</content>
				<desc>Message text warning the user that resetting device settings will erase all stored data and prompting the user to confirm the reset.</desc>
			</text>
			<text id="1048596">
				<content>Voulez-vous supprimer ce fichier : %1 ?</content>
				<desc>%1 = file name. Message text prompting the user to confirm deleting file.</desc>
			</text>
			<text id="1048597">
				<content>Voulez-vous supprimer ce dossier : %1 ?</content>
				<desc>%1 = folder name. Message text prompting the user to confirm deleting folder.</desc>
			</text>
			<text id="1048598">
				<content>Il n'y a aucun fichier journal des événements à afficher. Activez les journaux des événements pour enregistrer des événements.</content>
				<desc>Message text notifying the user that there are no event log files to view. The user must enable the recording of events before there can be events to view.</desc>
			</text>
			<text id="1048599">
				<content>Voulez-vous vous déconnectez %1 ?</content>
				<desc>%1 = name of the user currently logged in. Message prompting the user to confirm logging out the user.</desc>
			</text>
			<text id="1048600">
				<content>Sélectionnez une profondeur de chanfrein avant de sélectionner un programme.</content>
				<desc>A message prompting the user to select a groove depth in order to schedule selection.</desc>
			</text>
			<text id="1048601">
				<content>Sélectionnez un diamètre avant de sélectionner un programme.</content>
				<desc>A message prompting the user to select a diameter in order to schedule selection.</desc>
			</text>
			<text id="1048602">
				<content>Une erreur logicielle critique s'est produite. Patientez pendant la création du fichier de diagnostic...</content>
				<desc>A message prompting the user to restart the system since a critical error has occurred.</desc>
			</text>
			<text id="1048603">
				<content>Une erreur logicielle critique s'est produite. Redémarrez le système.</content>
				<desc>A message prompting the user to restart the system since a critical error has occurred.</desc>
			</text>
			<text id="1048604">
				<content>Seuls les paramètres de soudage essentiels seront conservés lors de la conversion des programmes au format Gryphon. Certaines fonctionnalités peuvent ne pas être disponibles sur les anciens systèmes. Tous les programmes convertis doivent être testés sur un système Gryphon avant d'être utilisés en production.</content>
				<desc>Gryphon refers to the name of the previous generation weld controller. A message informing the user of potential complications of exporting a weld schedule to a legacy version.</desc>
			</text>
			<text id="1048605">
				<content>Writing logs to file...</content>
				<desc>Message text notifying the user that the system is writing logs to the file.</desc>
			</text>
			<text id="1048606">
				<content>Select how you would like the verbose logs to be sorted.</content>
				<desc>Message text notifying the user that the system is writing logs to the file.</desc>
			</text>
			<!--Miscellaneous NOTE: DO NOT TRANSLATE-->
			<text id="16777216">
				<content></content>
				<desc>Blank space.</desc>
			</text>
			<text id="16777217">
				<content>20</content>
				<desc>The number 20.</desc>
			</text>
			<text id="16777218">
				<content>80</content>
				<desc>The number 80.</desc>
			</text>

		</language>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>