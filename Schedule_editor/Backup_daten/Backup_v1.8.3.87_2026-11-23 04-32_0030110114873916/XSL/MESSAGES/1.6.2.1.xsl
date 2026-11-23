<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language[@fileType='AXI']/str[@id='29']">
		<xsl:copy-of select="."/>
		<str id="30">
			<text>%1 velocity is not calibrated.</text>
			<desc>Detail to be added to another message. %1 = Axis name.</desc>
		</str>
		<str id="31">
			<text>%1 limits are not calibrated.</text>
			<desc>Detail to be added to another message. %1 = Axis name.</desc>
		</str>
	</xsl:template>
	
	<xsl:template match="/language[@fileType='SCH']/str[@id='47']">
		<xsl:copy-of select="."/>
		<str id="48">
			<text>One or more axes must be calibrated before starting a weld.|%1</text>
			<desc>%1 = Information on axes that are not calibrated</desc>
		</str>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>