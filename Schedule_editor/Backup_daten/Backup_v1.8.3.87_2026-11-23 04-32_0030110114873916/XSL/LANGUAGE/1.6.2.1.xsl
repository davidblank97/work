<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	
	<xsl:template match="/language/text[@id='523']">
		<xsl:copy-of select="."/>
	<text id="524">
		<content>AVC IDLE</content>
		<desc>Refers to a mode of operation of the 'Automatic Voltage Control' algorithm where the controller does put the AVC axis in sequence.</desc>
	</text>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>