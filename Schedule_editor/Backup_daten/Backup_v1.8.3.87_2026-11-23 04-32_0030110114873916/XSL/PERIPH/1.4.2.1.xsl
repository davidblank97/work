<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/peripheral/ports/comport[@channel='4']/port">
		<port>1</port>
	</xsl:template>
	
	<xsl:template match="/peripheral/ports/comport[@channel='4']/*[last()]">
		<xsl:copy-of select="."/>
		<handshake>RTS</handshake>
	</xsl:template>

	<!-- Do not change the template below -->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>