<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language[@fileType='COM']/str[@id='46']">
	    <xsl:copy-of select="."/>
		<str id="47">
			<text>General error. Index: %1. Subindex: %2.</text>
            <desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>
	</xsl:template>
	
	<xsl:template match="/language[@fileType='COM']/str[@id='48']">
        <str id="48">
            <text>Data cannot be transferred or stored to the application. Index: %1. Subindex: %2.</text>
            <desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
		</str>	
    </xsl:template>
  
    <xsl:template match="/language[@fileType='COM']/str[@id='49']">
        <str id="49">
            <text>Data cannot be transferred or stored to the application because of local control. Index: %1. Subindex: %2.</text>
            <desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
        </str>
    </xsl:template>
  
    <xsl:template match="/language[@fileType='COM']/str[@id='50']">
        <str id="50">
            <text>Data cannot be transferred or stored to the application because of present device state. Index: %1. Subindex: %2.</text>
            <desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
        </str>
    </xsl:template>
  
    <xsl:template match="/language[@fileType='COM']/str[@id='51']">
        <str id="51">
            <text>Object dictionary dynamic generation fails or no object dictionary is present. Index: %1. Subindex: %2.</text>
            <desc>CANopen Abort Code. %1 = object index of abort. %2 = sub index.</desc>
        </str>
    </xsl:template>
  
    <xsl:template match="/language[@fileType='COM']/str[@id='52']">
        <str id="52">
	        <text>Unknown CANopen error. Index: %1. Subindex: %2.</text>
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