<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language[@fileType='COM']/str[@id='23']">
		<str id="23">
			<text>Toggle bit not alternated. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
	
	<xsl:template match="/language[@fileType='COM']/str[@id='24']">
		<str id="24">
			<text>Toggle bit not alternated. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
	
	<xsl:template match="/language[@fileType='COM']/str[@id='25']">
		<str id="25">
			<text>Command specifier not valid. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
	
	<xsl:template match="/language[@fileType='COM']/str[@id='26']">
		<str id="26">
			<text>Invalid block size. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
	
	<xsl:template match="/language[@fileType='COM']/str[@id='27']">
		<str id="27">
			<text>Invalid sequence number. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>

	<xsl:template match="/language[@fileType='COM']/str[@id='28']">
		<str id="28">
			<text>CRC error. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
    </xsl:template>
	
	<xsl:template match="/language[@fileType='COM']/str[@id='29']">	
		<str id="29">
			<text>Out of memory. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
	
	<xsl:template match="/language[@fileType='COM']/str[@id='30']">
		<str id="30">
			<text>Unsupported access to an object. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
	
	<xsl:template match="/language[@fileType='COM']/str[@id='31']">	
		<str id="31">
			<text>Attempt to read a write only object. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
	
	<xsl:template match="/language[@fileType='COM']/str[@id='32']">	
		<str id="32">
			<text>Attempt to write a read only object. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>	
	
	<xsl:template match="/language[@fileType='COM']/str[@id='33']">
		<str id="33">
			<text>Object does not exist in the object dictionary. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>		
	
	<xsl:template match="/language[@fileType='COM']/str[@id='34']">
		<str id="34">
			<text>Object cannot be mapped to the PDO. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>	
	
	<xsl:template match="/language[@fileType='COM']/str[@id='35']">	
		<str id="35">
			<text>The number and length of the objects to be mapped would exceed PDO length. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
	
	<xsl:template match="/language[@fileType='COM']/str[@id='36']">	
		<str id="36">
			<text>General parameter incompatibility reason. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
	
	<xsl:template match="/language[@fileType='COM']/str[@id='37']">		
		<str id="37">
			<text>General internal incompatibility in the device. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
			
	<xsl:template match="/language[@fileType='COM']/str[@id='38']">	
		<str id="38">
			<text>Access failed due to a hardware error. Index: %1. Subindex: %2</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
		
	<xsl:template match="/language[@fileType='COM']/str[@id='39']">
		<str id="39">
			<text>Data type does not match, length of service parameter does not match. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
		
	<xsl:template match="/language[@fileType='COM']/str[@id='40']">
		<str id="40">
			<text>Data type does not match, length of service parameter too high. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
		
	<xsl:template match="/language[@fileType='COM']/str[@id='41']">
		<str id="41">
			<text>Data type does not match, length of service parameter too low. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
		
	<xsl:template match="/language[@fileType='COM']/str[@id='42']">
		<str id="42">
			<text>Sub-index does not exist. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
		
	<xsl:template match="/language[@fileType='COM']/str[@id='43']">
		<str id="43">
			<text>Value range of parameter exceeded (only for write access). Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
		
	<xsl:template match="/language[@fileType='COM']/str[@id='44']">
		<str id="44">
			<text>Value of parameter written too high. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
		
	<xsl:template match="/language[@fileType='COM']/str[@id='45']">
		<str id="45">
			<text>Value of parameter written too low. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
		
	<xsl:template match="/language[@fileType='COM']/str[@id='46']">
		<str id="46">
			<text>Maximum value is less than minimum value. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
		
	<xsl:template match="/language[@fileType='COM']/str[@id='48']">
		<str id="48">
			<text>General error. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
		
	<xsl:template match="/language[@fileType='COM']/str[@id='49']">
		<str id="49">
			<text>Data cannot be transferred or stored to the application. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
		
	<xsl:template match="/language[@fileType='COM']/str[@id='50']">
		<str id="50">
			<text>Data cannot be transferred or stored to the application because of local control. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
		
	<xsl:template match="/language[@fileType='COM']/str[@id='51']">
		<str id="51">
			<text>Data cannot be transferred or stored to the application because of present device state. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
		
	<xsl:template match="/language[@fileType='COM']/str[@id='52']">
		<str id="52">
			<text>Object dictionary dynamic generation fails or no object dictionary is present. Index: %1. Subindex: %2.</text>
			<desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>	
	</xsl:template>
		
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>