<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/language/text[@id='536']">
		<xsl:copy-of select="."/>
		<text id="537">
			<content>BOTH</content>
			<desc>N/A</desc>
		</text>	
		<text id="538">
			<content>WIRE SELECT MODE</content>
			<desc>Will enable the WIRE or WIRE2 axis depending on this value based on the TRAVEL axis direction.</desc>
		</text>	
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>