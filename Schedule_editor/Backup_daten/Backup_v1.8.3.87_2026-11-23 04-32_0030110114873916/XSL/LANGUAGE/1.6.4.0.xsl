<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language/text[@id='539']">
		<xsl:copy-of select="."/>
		<text id="540">
			<content>PULSE EDIT MODE</content>
			<desc>Specifies how pulse parameters are editted.</desc>
		</text>	
		<text id="541">
			<content>FREQUENCY</content>
			<desc>The rate at which something occurs</desc>
		</text>	
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>