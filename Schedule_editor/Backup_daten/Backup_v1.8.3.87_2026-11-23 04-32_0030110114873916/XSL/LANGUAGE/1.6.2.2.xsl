<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	
	<xsl:template match="/language/text[@id='524']">
		<xsl:copy-of select="."/>
		<text id="525">
			<content>WAITING FOR GAS TO FLOW</content>
			<desc>Notifying the user that the system is waiting for gas to start flowing at the specified flow rate.</desc>
		</text>
	</xsl:template>
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>