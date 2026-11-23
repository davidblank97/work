<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="/Parameters/param[@id='264488']">
		<xsl:copy-of select="."/>
		<param id="69133">
			<name>WIRE ASSIST MODE</name>
			<short_name/>
			<desc>Setting to specify when the wire assist will be enabled.</desc>
		</param>
	</xsl:template>
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>